#/bin/bash

tail -n +2 stop_times.txt | split -l 50000 - stop_times_split. -da 4
for file in stop_times_split*
do
    head -n 1 stop_times.txt > tmp_file
    cat "$file" >> tmp_file
    mv -f tmp_file "$file"
done