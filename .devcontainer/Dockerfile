FROM ignisda/developr-workspace:rust

RUN sudo apt-get update && \
    sudo apt-get -y install default-jre maven python3-venv dirmngr r-base r-base-dev \
    apt-transport-https ca-certificates software-properties-common gnupg2 libpq-dev \
    r-recommended r-base-dev ; \
    curl -sL https://deb.nodesource.com/setup_17.x | sudo bash - ; \
    sudo apt-get install -y nodejs ; \
    node --version ; \
    sudo yarn global add @nestjs/cli ;

RUN sudo apt-get install -y ruby-full python-is-python3
