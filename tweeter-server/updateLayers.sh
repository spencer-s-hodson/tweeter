# Use this file to update the lambda layers for each lambda.
# First create the new lambda layer, or lambda layer version, in aws by uploading the new lambda layer code.
# Then copy the arn for the lambda layer from aws to the .server LAMBDALAYER_ARN variable.
# Then run this script.

source .server

i=1
PID=0
pids=()
for lambda in $EDIT_LAMBDALIST
do
    aws lambda update-function-configuration --function-name  $lambda --layer $LAMBDALAYER_ARN 1>>/dev/null & 
    echo lambda $i, $lambda, updating lambda layer...
    pids[${i-1}]=$!
    ((i=i+1))
done
for pid in ${pids[*]}; do
    wait $pid
done
echo Lambda layers updated for all lambdas in .source