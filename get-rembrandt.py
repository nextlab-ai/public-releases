from io import StringIO
from os import environ, getenv
from pathlib import Path
from subprocess import check_output, STDOUT
from sys import stderr, CalledProcessError

REGION_NAME = "ap-northeast-1"
REPOSITORY = "development"
DOMAIN = "ias"
pip_extra_index_url = ""
docker_secret_path = Path("/tmp/pip-extra-index-url")
docker_usage = rf"""
*** Use following snippet for Docker builds: ***

# Dockerfile
RUN pip install boto3
RUN --mount=type=secret,id=pip-extra-index-url,target=/tmp/pip-extra-index-url \
    curl -f https://raw.githubusercontent.com/nextlab-ai/public-releases/main/get-rembrandt.py | python \
    && python -c "import Rembrandt"

# docker-compose.yml
services:
    foo:
        build:
            secrets: pip-extra-index-url
secrets:
    pip-extra-index-url:
        name:
        file: {docker_secret_path}
"""

if parent_pip_extra_index_url := getenv("PIP_EXTRA_INDEX_URL"):
    pip_extra_index_url = parent_pip_extra_index_url
elif docker_secret_path.exists():
    pip_extra_index_url = docker_secret_path.read_text()
else:
    import boto3

    account_id = boto3.client("sts").get_caller_identity().get("Account")

    client = boto3.client("codeartifact", region_name=REGION_NAME)
    response = client.get_authorization_token(domain=DOMAIN, domainOwner=account_id)
    print(response, file=stderr)

    pip_extra_index_url = f'https://aws:{response["authorizationToken"]}@{DOMAIN}-{account_id}.d.codeartifact.{REGION_NAME}.amazonaws.com/pypi/{REPOSITORY}/simple/'

print("export PIP_EXTRA_INDEX_URL=" + pip_extra_index_url)
try:
    docker_secret_path.write_text(pip_extra_index_url)
    print(docker_usage,
        file=stderr,
    )
except OSError:
    ...

try:
    stderr.buffer.write(check_output(
        ["pip", "install", "rembrandt"],
        stderr=STDOUT,
        env=None
        if parent_pip_extra_index_url
        else {**environ, "PIP_EXTRA_INDEX_URL": pip_extra_index_url},
    ))
except CalledProcessError as error:
    print(error.output, file=stderr)
    raise error
