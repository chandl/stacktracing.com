---
title: "3 Easy Steps to Install Jellyfin with Docker-Compose"
date: 2022-09-24
description: ""
image: "/wp-content/uploads/2022/09/Violet-and-White-Simple-Bold-Business-Promo-LinkedIn-Article-Cover-Image-1.jpg"
wpPath: "/jellyfin-with-docker-compose/"
---

Jellyfin is a free and open-source media solution, similar to the proprietary solutions Emby and Plex, that can be used as your own private streaming service. You supply the media (movies, TV shows, music, Live TV/DVR) and then you can play it from anywhere! There's no tracking, centralized accounts, or subscription fees you ever have to pay, and you 100% control all of the data. It is truly a no-strings-attached media application.

In this article, you will learn the three easy steps to install Jellyfin with Docker-Compose (installing docker/docker-compose, creating a Jellfyin docker-compose.yml, and running Jellyfin with docker-compose). It's a straightforward process, so you should be able to get up and running within minutes!

# Install Docker and Docker-Compose

Docker is an open platform widely used to build, ship, and run applications as a single package. This means you don't have to worry about dependencies, messing your main system up, conflicts with other software, or any other troubles caused by installing software directly on your host.

The installation process differs from host to host, depending on which operating system you have. Detailed instructions can be found on the Docker documentation website: [https://docs.docker.com/engine/install](https://docs.docker.com/engine/install)/. For Windows and Mac, you can install a GUI called Docker Desktop. Docker Desktop will contain all of the docker and docker-compose binaries that you need to run Jellyfin.

In the case that you are running Oracle Linux, you can read [6 Easy Steps to Install Docker on Oracle Linux 7/8 (+ Docker Compose)](/install-docker-on-oracle-linux/) for a detailed breakdown of how to install docker and docker-compose.

For all other operating systems, you may need to do some more digging online to find the right way to install docker/docker-compose.

# Create a docker-compose.yml for Jellyfin

Now that docker and docker-compose are installed on your host, you need to create a docker-compose.yml file that describes how docker should run Jellyfin. Here is the specific docker-compose.yml that I use with Jellyfin. See the following sections for a breakdown of all of these variables.

```
---
version: "2.1"
services:  
  jellyfin:
    image: ghcr.io/linuxserver/jellyfin:latest
    container_name: jellyfin
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Los_Angeles
    volumes:
      - /mnt/hdd/config/jellyfin:/config
      - /mnt/hdd/library/tv:/data/tvshows
      - /mnt/hdd/library/movies:/data/movies
      - /dev/vcsm:/dev/vcsm
      - /dev/vchiq:/dev/vchiq
    ports:
      - 8096:8096
      - 8920:8920 #optional
      - 7359:7359/udp #optional
      - 1900:1900/udp #optional
    restart: unless-stopped
```

## Which Image to Use for Jellyfin with Docker-Compose

There are a couple of options to choose from when deciding which docker image to use with Jellyfin, but I prefer the `linuxserver/jellyfin` image found here: [https://hub.docker.com/r/linuxserver/jellyfin](https://hub.docker.com/r/linuxserver/jellyfin) and use the `latest` tag, which provides stable releases.

*   They provide x86 and ARM-supported images (great for running on Raspberry PI)
*   They manage application updates (regularly) and OS updates (weekly)
*   They provide regular security updates and patches to the image.
*   They have common docker layers between many of their images (many related to getting media), which can help to reduce space usage.

## Setting up Jellyfin Media Volumes

Since Jellyfin is a Media server, you need to give it access to some media to play! To do that, we specify `volumes` in the docker-compose file. These volumes link locations on the real host to locations inside of the container.

The main media volumes that I am configuring here are `/data/tvshows` and `/data/movies`. These are pretty self-explanatory, hosting TV shows and movies, respectively.

In addition, you need to configure a volume for where configuration data for Jellyfin is stored. I do this in the `/config` volume.

Finally, there are a couple of other volumes that are specified in the configuration (`/dev/vcsm` and `/dev/vchiq`). These will be discussed in the 'Hardware Encoding' section below.

## Jellyfin Environment Variables

The environment variables in the `docker-compose.yml` file are as follows:

*   `PUID=1000` and `GUID=1000`
    *   These variables are used to determine which user ID and group ID should be used to access files in the specified volumes.
    *   When using volumes, permissions issues can often happen between the host and the docker container, so specifying these variables is necessary to avoid those issues.
    *   In order to get the correct IDs for your system, run `id <username>` where `<username>` is the user that owns the volumes.
*   `TZ=America/Los_Angeles`
    *   This variable sets the application's timezone. You can find a reference for all of the timezone identifiers here: [https://en.wikipedia.org/wiki/List\_of\_tz\_database\_time\_zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

## Ports for Jellyfin

In this docker-compose file, we specify 4 ports to forward between the docker container and our host.

*   **8096**: this TCP port exposes the HTTP Web UI for Jellyfin. This web UI is used as the main entrypoint for watching your media, so it is not optional to expose this (unless you are running some kind of reverse proxy - not described here).
*   **8920:** this TCP port exposes the HTTP**S** Web UI for Jellyfin; however, you need to set up your own SSL certificate for this (optional).
*   **7359:** this UDP port is used for client discovery on your local network (optional).
*   **1900:** this UDP port is used for service discovery by DNLA and clients (optional).

## Hardware Acceleration in Jellyfin

Jellyfin supports hardware acceleration for encoding and decoding video. Basically, some hardware (e.g. CPUs/GPUs) have some built-in functionality that can be utilized by Jellyfin to really speed up the process of encoding/decoding video. This can often offload a lot of resource utilization, as the hardware acceleration is much more efficient.

In this docker-compose example, I am exposing a couple of volumes (`/dev/vcsm` and `/dev/vchiq`). These volumes are device identifiers for the Raspberry PI which can be used to do hardware encoding. If you are not planning to run Jellyfin on a Raspberry PI, you can look into using Intel or Nvidia hardware acceleration, depending on what specs your system is running. For more details on hardware acceleration on these other platforms, you can refer to the `linuxserver/jellyfin` documentation [https://hub.docker.com/r/linuxserver/jellyfin](https://hub.docker.com/r/linuxserver/jellyfin).

## Additional Parameters

The only other parameter in this docker-compose file specifies restart behavior: `restart: unless stopped`. This makes the container not restart until you explicitly stop it. That means even if your host reboots, the container will not be restarted.

# Running and Setting Up Jellyfin with Docker-Compose

Now that you have a `docker-compose.yml` file configured to run Jellyfin, the only thing to do is to start it!

To run the docker-compose file, run `docker-compose up -d` in the same directory that you have `docker-compose.yml` saved. This will start the container in the background.

![Running docker-compose to start Jellyfin](/wp-content/uploads/2022/09/jfin-install.jpg)

After waiting a few seconds for the application to start, you should be able to reach it in your web browser at `http://server-ip:8096` (where `server-ip` is the IP/hostname of the host that is running docker-compose). This should bring you to a Jellyfin setup wizard.

![](/wp-content/uploads/2022/09/jfin-setup-1024x407.jpg)

**Jellyfin Configuration:** Selecting a display language.

In this Jellyfin setup wizard, you will set up your language, configure users, add the media libraries that we mapped as volumes, and set up remote access.

![Creating a user in Jellyfin](/wp-content/uploads/2022/09/jfin-setup-2-1024x481.jpg)

**Jellyfin Configuration:** Creating an Admin User.

![Adding a Media Library for Movies in Jellyfin](/wp-content/uploads/2022/09/jfin-setup-3-1024x769.jpg)

**Jellyfin Configuration:** Adding Media Libraries (TV & Movies).

![Movies and TV shows configured as libraries.](/wp-content/uploads/2022/09/jfin-lib-configured-1024x416.jpg)

**Jellyfin Configuration:** Finished adding Movies and TV shows as libraries.

After configuring these things, continue through the setup wizard until completion. Then you are done! You can add media files manually to the mapped volumes and watch them through Jellyfin.

_Note_: _if you are intending to use hardware acceleration, you should log in as the user you created, go to settings in the web UI, and configure hardware acceleration with the devices that you mapped as volumes._

# Updating Jellyfin with Docker-Compose

Updating Jellyfin with docker-compose is extremely simple and can be done in just a couple of commands.

1.  Update all images with `docker-compose pull` - if you specify your Jellyfin image using the `:latest` tag, it will pull the latest stable changes.
2.  Once the images are downloaded/updated, you can shut down your existing Jellyfin instance and then re-create it. This re-created instance will be running the updated image. To do that run docker-compose down and then docker-compose up -d again.
3.  Voila! Your Jellyfin application is updated. Verify that you can still log in and use it properly. If everything functions properly, you can remove the old image from your machine with `docker image prune`.

# Next Steps

Now that you have Jellyfin configured and running, you can think about how to get more media to watch! If you are interested in learning more about some other handy containers that can work together to make your media experience awesome, please leave a comment and let me know if you'd be interested! For now, here are the containers that I use to manage and grow my media library, each of which has a handy docker image provided by `linuxserver`:

*   Sonarr (find and download TV)
*   Radarr (find and download Movies)
*   Prowlarr (find and aggregate download sites and torrents)
*   Transmission (torrent client).
