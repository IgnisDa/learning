FROM ignisda/developr-workspace:rust

RUN sudo apt-get -y install default-jre maven python3-venv dirmngr r-base r-base-dev \
    apt-transport-https ca-certificates software-properties-common gnupg2 \
    r-recommended r-base-dev ; \
    sudo yarn global add @nestjs/cli ;

RUN set fish_greeting ; \
    sudo rm -rf $HOME/.config ; \
    git clone https://github.com/IgnisDa/linux-configs.git $HOME/.config ; \
    sudo chown -R $USERNAME:$USERNAME $HOME/.config ; \
    git config --global user.name "$GIT_AUTHOR_NAME" ; \
    git config --global user.email "$GIT_AUTHOR_EMAIL" ;

RUN sudo apt-get install -y ruby-full python-is-python3 ; \
    sudo gem install solargraph rubocop bundler
