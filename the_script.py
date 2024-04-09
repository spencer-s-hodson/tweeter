import os

layer_name = "Tweeter-Layer"

# Npm run build in tweeter-shared
os.system("cd tweeter-shared && npm run build")
# Return to the initial directory, assuming tweeter-server is at the same level as tweeter-shared
os.system("cd tweeter-server && tsc")
# Delete tweeter-shared from nodejs/node_modules, then re-copy over tweeter-shared
os.system(
    "rm -rf tweeter-server/nodejs/node_modules/tweeter-shared && cp -r tweeter-shared tweeter-server/nodejs/node_modules/"
)
# Rezip both .zip files
# Assuming you start from the project root directory
os.system(
    "cd tweeter-server && rm nodejs.zip && rm dist.zip && zip -r nodejs.zip nodejs && zip -r dist.zip dist"
)
# Upload nodejs.zip to the designated layer
# Note: The following commands involving AWS CLI operations that expect JSON output should ideally be handled differently, as os.system() may not be the best choice for capturing output
os.system(
    f"aws lambda publish-layer-version --layer-name {layer_name} --zip-file fileb://tweeter-server/nodejs.zip --compatible-runtimes nodejs20.x"
)
# For aws lambda list-layer-versions and subsequent operations, consider using a different approach

# The handling of AWS CLI commands that require capturing output, such as `aws lambda list-layer-versions`, is not correctly addressed here. `os.system()` does not capture output for later use in the script. Instead, consider using `subprocess` module with `subprocess.check_output()` for commands where you need to capture the output.
import subprocess
import json

# Example command that captures output
output = subprocess.check_output(
    ["aws", "lambda", "list-layer-versions", "--layer-name", layer_name], text=True
)
layer_versions = json.loads(output)
arn = layer_versions["LayerVersions"][0]["LayerVersionArn"]
# Open .server. Replace the arn with the new arn
# Step 1: Read the file and store lines
with open(".server", "r") as file:
    data = file.readlines()

# Step 2: Modify the data as needed
for i in range(len(data)):
    if "LAMBDALAYER_ARN" in data[i]:
        data[i] = f"LAMBDALAYER_ARN={arn}\n"

# Step 3: Write the modified data back to the file
with open(".server", "w") as file:
    file.writelines(data)
# Run updateLayers.sh
os.system("sh tweeter-server/updateLayers.sh")
# Run the update.sh
os.system("sh tweeter-server/uploadLambdas.sh")
# It works
os.system("cd tweeter-web && npm run build && npm run start")