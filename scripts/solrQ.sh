#!/bin/bash -Eux

curl 'http://localhost:8983/solr/db/select?q=lyrics%3Acomo&wt=json&rows=5'
