---
title: "6 Easy Steps to Install Docker on Oracle Linux 7/8 (+ Docker Compose)"
date: 2021-11-06
description: "The 6 steps to install Docker on Oracle Linux. A fairly quick and simple installation that should only take you between 5-10 minutes."
image: "/wp-content/uploads/2021/11/Violet-and-White-Simple-Bold-Business-Promo-LinkedIn-Article-Cover-Image-1.png"
wpPath: "/install-docker-on-oracle-linux/"
---

In this post, you will see how to install Docker on Oracle Linux. These instructions are applicable for Oracle Linux 7 and Oracle Linux 8, and we will be installing Docker Community Edition as well as docker-compose. At the end, you will find a single command that you can copy/paste to do all of this at once!

[Oracle Linux](https://www.oracle.com/linux/) is an open-source and free operating system comparable to Red Hat Enterprise Linux (RHEL) and CentOS. It is the default operating system used for instances in Oracle Cloud Infrastructure and is often used to host enterprise applications.

Many times, the applications that you want to run on your Oracle Linux server are containerized using Docker. By default, Oracle Linux does not have Docker installed, so these applications cannot run out of the box. In this article, we will go over how to install [Docker Community Edition](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) on Oracle Linux 7 or 8 so that you can run containerized applications.

* * *

# Install Docker on Oracle Linux

## Update Your System

```
# Update your yum repo cache and update installed packages.
sudo yum update
```

This command is used multiple times in our full command chain. This command is used to ensure that your system has the latest version of applications and refreshes your yum cache, so if you install any new applications, they will be the latest version. If you're interested in other yum commands, check out this [yum cheatsheet](https://github.com/uidmehdi/cheat-sheets/blob/master/Yum.md).

## Install yum-utils For Easy Repository Management

```
# Install yum-utils
sudo yum install -y yum-utils
```

In order to download Docker CE using `yum`, you must add the Docker yum repository to your local yum repositories. By default, Oracle Linux does not track the Docker repositories.

In order to do this, the easiest way is to first need to install a tool called [yum-utils](https://linux.die.net/man/1/yum-utils). This will allow you to add a new repository without having to edit many files.

## Add the Docker Repository to Install Docker on Oracle Linux

```
# Add the new Docker Repository and update your yum caches 
# so that the latest Docker versions can be installed.
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo && \
     sudo yum update
```

After installing the `yum-utils` tool, you can use the `yum-config-manager` tool to install the Docker repository. Once the repository is added, you can update your system again to retrieve the latest Docker versions in your yum cache.

## Install the Docker CE Binaries on Oracle Linux

```
# Install the actual Docker CE Application
sudo yum install docker-ce docker-ce-cli containerd.io
```

Now that your system has the Docker repository enabled, you can install Docker CE on your system. This command will retrieve, unpack, and install docker on your system.

In some cases, you may receive the following error when attempting to run this `yum install` command.

```
# yum install error
-->; Finished Dependency Resolution
Error: Package: docker-ce-rootless-extras-20.10.7-3.el7.x86_64 (docker-ce-stable)
           Requires: fuse-overlayfs >= 0.7
Error: Package: docker-ce-rootless-extras-20.10.7-3.el7.x86_64 (docker-ce-stable)
           Requires: slirp4netns >= 0.4
```

In order to fix this error, you can update the `/etc/yum.repos.d/oraclelinux-developer-ol7.repo` or `/etc/yum.repos.d/oraclelinux-developer-ol8.repo` file (depending on the version of Oracle Linux you are using).

Under the `[ol7_developer]` or `[ol8_developer]` section, set `enabled=1`.

```
# Update this in /etc/yum.repos.d/oraclelinux-developer-ol7.repo
[ol7_developer]
name=Oracle Linux $releasever Development Packages ($basearch)
baseurl=https://yum$ociregion.$ocidomain/repo/OracleLinux/OL7/developer/$basearch/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
gpgcheck=1
enabled=0 # -->; change this value to 1
```

After updating this file, you should update yum and retry the installation command:

```
# Update yum and Retry the Install for Docker CE
sudo yum update && sudo yum install docker-ce docker-ce-cli containerd.io
```

## Make sure Docker Starts when the System Starts

```
# Setup Docker to Start whenever the system restarts 
# and manually start the docker service now.
sudo systemctl enable docker && sudo systemctl start docker
```

Docker is installed now, we just need to make sure it will start back up if your server is restarted or if it has any issues. To do this, we execute the command `systemctl enable docker`. This just enables the application on startup. Finally, we will also manually start docker using `systemctl start docker`; it should be started after the installation is finished; however, we will do it again just to be sure.

## Resolve Common Docker Permission Issues

```
# Common Permission Error seen when running docker commands.
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/v1.40/containers/json: dial unix /var/run/docker.sock: connect: permission denied
```

Now you have docker setup; however, if you try to run any `docker` command, you'll likely see the above error. One solution is to just prepend `sudo` before you use any `docker` commands. However, in order to mitigate this and simplify things, you can update your user to be a part of the `docker` group. This will allow you to run any `docker` commands without using `sudo`.

```
# Create the 'docker' group and add your user to it.
sudo groupadd docker && \
     sudo usermod -aG docker $USER
```

To test your permissions after running these commands, just execute `docker ps`, if it does not throw the same error as above, you are golden!

## Install `docker-compose` (Optional)

[docker-compose](https://docs.docker.com/compose/install/) is a tool for defining and running multi-container Docker applications. Compose uses YAML files to set up application services. With the YAML files, you can create and start all the services from the configuration with one command. It is not included by default when you install Docker, so some additional installation is needed.

In these instructions, we will use `pip` to install docker-compose on oracle linux. This should work across all architectures (x86, ARM64, etc..). If you don't want to use this method, you can attempt to follow the instructions listed on the [docker-compose website](https://docs.docker.com/compose/install/).

First, you need to install some pre-requisites in order to install docker-compose using `pip`.

```
# Install docker-compose pre-requisites
sudo yum install -y libffi libffi-devel openssl-devel python3 python3-pip python3-devel
```

After the pre-requisites are installed, you can use the following command to install docker-compose itself.

```
# Install docker-compose with pip
sudo pip3 install docker-compose
```

## Conclusion - TL;DR All in One Command

You can copy/paste the following block of commands to install Docker CE and docker-compose on your Oracle Linux system. All of these commands are described above. However, this is the TL;DR version for your convenience.

```
# All of the Commands to Install Docker CE via Yum and assign your current user permissions
sudo yum update && 
sudo yum install -y yum-utils && 
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo && 
sudo yum update && 
sudo yum install docker-ce docker-ce-cli containerd.io && 
sudo systemctl enable docker && 
sudo systemctl start docker && 
sudo groupadd docker && 
sudo usermod -aG docker $USER && 
sudo yum install -y libffi libffi-devel openssl-devel python3 python3-pip python3-devel && 
sudo pip3 install docker-compose
```

Just copy/paste this block of commands into your Oracle Linux system and it will:

*   Update your system packages
*   Install `yum-utils` to easily manage repositories.
*   Install Docker CE
*   Set Docker to run on startup
*   Start Docker
*   Update your current user to have permissions to use Docker without `sudo`
*   Installs docker-compose pre-requisites and docker-compose itself.
