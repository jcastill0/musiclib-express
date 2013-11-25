import os
import os.path
import MySQLdb
import sys

newArtistsCnt = 0
newSongsCnt = 0


class Artist:
	id = None
	name = None


try:
  conn = MySQLdb.connect(host='localhost', user='root', passwd='root', db='musicdb')
except MySQLdb.Error, e:
	print "Error %d: %s" % (e.args[0], e.args[1])
	sys.exit(1)


def read_artists (dirName, artistDict):
    for f in os.listdir (dirName):
	if f == 'Various Artists':
	    continue
	artist = Artist()
	artist.name = f
	artistDict.update({artist.name:artist})
    for f in os.listdir (dirName + "/" + 'Various Artists'):
	artist = Artist()
	fileName = f.split (' - ')
	artist.name = fileName[0]
	artistDict.update({artist.name:artist}); 


def insert_artists (artistDict, conn):
    global newArtistsCnt
    try:
	cursor = conn.cursor()
	for artistName, artistObj in artistDict.iteritems():
	    cursor.execute(
		"""SELECT id FROM artist WHERE name = %s""", artistName)
	    artistID = cursor.fetchone()
 	    if (artistID is None):
		cursor.execute(
			"""INSERT INTO artist (name) VALUES (%s)""", artistName)
		artistID = cursor.lastrowid
		newArtistsCnt = newArtistsCnt + 1
	    artistObj.id = artistID
	    artistDict.update({artistObj.name:artistObj});
	conn.commit()
	cursor.close()
    except MySQLdb.Error, e:
	print "Error %d: %s" % (e.args[0], e.args[1])
	conn.close()
	sys.exit(1)

def print_artist (artistDict):
	for artist in artistDict:
		print artist

def read_songs (dirName, artistDict, conn):
#   print ("DIRN:" + dirName)
    global newSongsCnt
    try:
	cursor = conn.cursor()
	for f in os.listdir (dirName):
	    filePath = dirName + "/" + f
	    if (os.path.isdir (filePath)):
#		print ("ISDIR:"+filePath)
		read_songs(filePath, artistDict, conn)
		continue
	    fileName = f.split (' - ')
	    artistName = fileName[0]
	    songNameWithExtension = fileName[1]
	    dotIX = songNameWithExtension.rfind('.')
	    songName = songNameWithExtension[0:dotIX]
	    cursor.execute(
		"""SELECT id FROM artist WHERE name = %s""", artistName)
	    artistID = cursor.fetchone()
	    if (artistID is None):
		print ("Artist not found:" + artistName)
		continue
	    cursor.execute(
		"""SELECT id FROM song WHERE artist_id = %s AND name = %s""", (artistID[0], songName))
	    songID = cursor.fetchone()
	    if (songID is None):
#		print ("NEW Song:" + songNamefilePath)
		newSongsCnt = newSongsCnt + 1
		cursor.execute(
			"""INSERT INTO song (name, artist_id, file_path, created) VALUES (%s, %s, %s, NOW())""", (songName, artistID[0], filePath))
	conn.commit()
	cursor.close()
    except MySQLdb.Error, e:
        print "Error %d: %s" % (e.args[0], e.args[1])
        conn.close()
        sys.exit(1)


artistDict = dict ()
read_artists("/home/julio/MusicSrc/", artistDict)
insert_artists (artistDict, conn)
read_songs("/home/julio/MusicSrc", artistDict, conn)
#print_artist (artistDict)
conn.close()
print ("NewArtists:" + str(newArtistsCnt) + " NewSongs:" + str(newSongsCnt))
