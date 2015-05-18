#!/bin/bash -Eux

curl 'http://localhost:8983/solr/db/dataimport?command=fullimport'
