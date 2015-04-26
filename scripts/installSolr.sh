#!/bin/bash -Eux

cd $SOLR_HOME
ln -s ~/dev/workspace/musiclib-express/solr/lib
ln -s ~/dev/workspace/musiclib-express/solr/conf
cd example/example-DIH/solr/db/conf
mv db-data-config.xml db-data-config.orig
ln -s ../../../../../conf/db-data-config.xml
mv schema.xml schema.orig
ln -s ../../../../../conf/schema.xml
cd ../lib
ln -s ../../../../../lib/mysql-connector-java-5.1.34-bin.jar
