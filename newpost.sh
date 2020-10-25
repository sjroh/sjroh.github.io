#!/bin/bash
# ------------------------------------------------------------------
# [Author]  Si Jine Roh
#           Automatically create the new post file for Jekyll
#           by give title (with date)
# ------------------------------------------------------------------

VERSION=0.0.1
USAGE="Usage: command -t \"title\" [-d YYYY-MM-DD]"

# --- Options processing -------------------------------------------
if [ $# == 0 ] ; then
    echo $USAGE
    exit 1;
fi

# default value
date_set=0

while getopts "d:t:vh" optname
    do
        case "$optname" in
            "v")
                echo "Version $VERSION"
                exit 0;
                ;;
            "h")
                echo $USAGE
                exit 0;
                ;;
            "t")
                title=$OPTARG
                ;;
            "d")
                date_set=1
                date=$OPTARG
                ;;
            *)
                echo "Unknown error while processing options"
                exit 0;
                ;;
        esac
    done

# --- Body --------------------------------------------------------
current_date=`date +"%Y-%m-%d"`
if [ $date_set == 1 ] ; then
    current_date=$date
fi
current_time=`date +"%H:%M:%S"`
current_timezone=`date +"%z"`
file_name=$current_date-${title// /-}.markdown
file_path=./_posts/$file_name
touch $file_path
echo --- >> $file_path
echo layout: post >> $file_path
echo title:  \"$title\" >> $file_path
echo date:   $current_date $current_time $current_timezone >> $file_path
echo categories:  >> $file_path
echo tags:  >> $file_path
echo --- >> $file_path
echo $file_path created!
# -----------------------------------------------------------------