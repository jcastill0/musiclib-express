#!/bin/bash -Eux

curl 'http://localhost:8983/solr/db/select?q=lyrics%3Acomo&wt=json&rows=5'

curl 'http://localhost:8983/solr/db/select?q=%22rayo+de%22&wt=json&rows=5'
