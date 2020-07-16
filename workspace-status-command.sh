#!/bin/sh

cat <<EOF
BUILD_DATE $(date ${SOURCE_DATE_EPOCH:+"--date=@${SOURCE_DATE_EPOCH}"} -u +'%Y-%m-%dT%H:%M:%SZ')
COMMIT_SHA `git describe --abbrev=0 --always --dirty`
EOF
