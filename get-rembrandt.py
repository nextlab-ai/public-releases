from io import StringIO
from os import environ, getenv
from pathlib import Path
from subprocess import check_output, STDOUT
from sys import stderr

REGION_NAME = "ap-northeast-1"
REPOSITORY = "development"
DOMAIN = "ias"
pip_extra_index_url = ""
docker_secret_path = Path("/tmp/pip-extra-index-url")

if parent_pip_extra_index_url := getenv("PIP_EXTRA_INDEX_URL"):
    pip_extra_index_url = parent_pip_extra_index_url
elif docker_secret_path.exists():
    pip_extra_index_url = docker_secret_path.read_text()
else:
    import boto3

    account_id = boto3.client("sts").get_caller_identity().get("Account")

    client = boto3.client("codeartifact", region_name=REGION_NAME)
    response = client.get_authorization_token(domain="ias", domainOwner=account_id)
    print(response, file=stderr)

    pip_extra_index_url = f'https://aws:${response["authorizationToken"]}@${DOMAIN}-${account_id}.d.codeartifact.${REGION_NAME}.amazonaws.com/pypi/${REPOSITORY}/simple/'

print("export PIP_EXTRA_INDEX_URL=" + pip_extra_index_url)
docker_secret_path.write_text(pip_extra_index_url)
print(f"""
# Dockerfile example


# docker-compose.yml example
services:
    foo:
        build:
            secrets: pip-extra-index-url
secrets:
    pip-extra-index-url:
        file: {docker_secret_path}
    """,
        file=stderr,
)

stderr.buffer.write(check_output(
    ["pip", "install", "rembrandt"],
    stderr=STDOUT,
    env=None
    if parent_pip_extra_index_url
    else {**environ, "PIP_EXTRA_INDEX_URL": pip_extra_index_url},
))
