---
title: "How to Hack WiFi Passwords With Aircrack-Ng [WEP/WPA2]"
date: 2022-09-02
description: "Learn how to hack Wi-Fi passwords with Aircrack-Ng. I'll show you how to set up and use the wi-fi hacking program to hack WEP, WPA, and WPA2-secured networks."
image: "/wp-content/uploads/2022/09/Violet-and-White-Simple-Bold-Business-Promo-LinkedIn-Article-Cover-Image.jpg"
wpPath: "/wifi-hacking-with-aircrack-ng/"
---

With wireless networks being everywhere, there have to be some forms of protection against unwanted people gaining access. However, some methods of protecting wireless networks are only _somewhat_ effective and **the tools to break these methods are only getting stronger**. In this post, I'll show you how to install, use, and explore one of these tools - the popular (and powerful) Wi-Fi hacking suite Aircrack­-ng.

Aircrack­-ng is a complete set of tools made for assessing WiFi network security. Aircrack­-ng focuses on monitoring, attacking, testing, and cracking wireless networks \[1\]. In this post, I will use Aircrack­-ng in a completely command­-line based environment on a physical machine.

## Limitations

With wireless cracking, there can be a big hardware limitation in some circumstances. A lot of advanced wireless password cracking techniques use a technique called “packet injection”, also known as “packet spoofing”. Packet injection allows for the attacker to interfere with an established network connection, by constructing packets to appear as if they are a normal part of the communication stream. \[1\]

During the process of setting up Aircrack­-ng, I found that my wireless card is not able to perform packet injection. This did not completely limit my options and testing, as some sniffing and cracking features of Aircrack­-ng work without having packet injection working. It is also worth noting that on Windows-based machines, packet injection is impossible with Aircrack­-ng and is a fundamental limitation.

## WiFi Basics

Wi­Fi is run under the IEEE 802.11 protocol. This protocol lays out specifics for how wireless networks are broadcasted and how security features are implemented in wireless networks, as well as a plethora of other media access control and physical layer specifications.

### Wireless Network Properties

​Managed wireless networks with Access Points (AP) all have a certain set of information that is constantly broadcasted to everyone in range. Every AP sends out 10 “beacon frames” per second.  These beacon frames give fundamental information about the network. Included in this information is the name of the network (ESSID), if encryption is used (and if so, what type), what data rates are supported (in MBit/s), and what channel the network is on. \[1\]

When broadcasting, the AP gives out its MAC address. Every network hardware device has a MAC address to communicate with each other. This is essential in communicating directly with the AP, especially in Aircrack­-ng where APs are referenced specifically by their corresponding MAC addresses.

There are a few different ways to secure a network, but the most popular is with an outdated security algorithm: WEP. To provide a certain level of security, the IEEE 802.11 standard provides two types of authentication methods, Open System and Shared Key. With open system authentication, a wireless device can join any network and receive any messages that are not encrypted. On the other hand with shared key authentication, only devices with the correct authentication key can join the network. \[5\]

### Connecting to a Network

WEP is the most commonly used protocol for securing wireless networks, and open system authentication is most commonly used on that (it is often set as default or even unchangeable for a lot of routers). With open system authentication, there are four steps for a device to be authenticated and then to connect to a network.

During the first step: the device asks the AP for authentication. In the second step, the AP answers and authenticates the device provided that they gave the correct key. Then in step three, the device asks the AP for association (to associate the device’s MAC address with authenticated devices). In the fourth step, the AP answers, associating the device and allowing it to connect. \[1\]

This example is the most common, but most simple case. There can be many factors that change the authentication process. For example, if WPA or WPA2 is in use, the AP will deny the device at step 2, as EAPOL authentication is used instead of open system authentication. Another tricky situation is if the AP has a list of allowed MAC addresses, and blocks any other connection attempt (MAC filtering). Finally, if the AP is using shared key authentication, you have to supply the correct key to be able to connect. With Aircrack­-ng, you can perform shared­key fake authentication to break this security measure. \[1\]

## Setting up Aircrack-Ng

Setting up Aircrack­-ng was quite a task. Many prerequisites are required to be installed before Aircrack­-ng itself, and sometimes they don’t properly work with your system. In most cases of installing Aircrack­-ng, there are 4 major steps: finding your network card, downloading your network card’s driver, patching that driver to allow packet injection, and then installing Aircrack­-ng itself.

### Finding the Network Card

The first step of the installation was to find out what network card the machine was using. I already knew that the network card built into the machine was a PCI device, but I needed more information. To get that, I used the command `**lspci ­-nn**` to find the PCI devices:

![Command Output of lspci](/wp-content/uploads/2022/09/lspci-1024x57.jpg)

**Command Output of `lspci`**

From the results of this command, I found that the network card was a `Broadcom BCM4331 802.11a/b/g/n` card with `14e4:4331` being the PCI ID. This PCI ID was important for later steps while finding the exact device on driver websites.

After finding out the wireless card’s chipset (`Broadcom bcm43xx`), I looked up if it was supported. Aircrack­-ng hosts a list of supported chipsets at \[2\], this includes many different chipset manufacturers and provides information about which drivers are needed for Aircrack­-ng’s functionality to work. I found that the chipset is partially supported, in that I can use Aircrack­-ng without packet injection functionality. I also found that our machine needed a new driver to be compatible with Aircrack­-ng.

### Downloading Drivers

Aircrack-­ng’s website which displayed chipset support information \[2\] also displays the drivers needed for each chipset to work properly. In my case, I could choose between two drivers: the `Broadcom peek` driver/`bcm43xx` driver and the `b43` driver. On the website \[2\], it lists the `b43` driver as an “excellent and fully supported driver”. This means that devices using this driver are fully supported and can do packet injection and all of the advanced networking features that Aircrack­-ng has to offer.

This would be a wonderful thing, except that our `14e4:4311` device was not currently supported under that, and can't inject packets. Since I was uncertain if the device would even work with the `b43` driver, I looked up documentation for it and found a compatibility list at \[3\]. On this list, I found that our device supported the driver from version `3.2­rc3` and up.

For the sake of driver compatibility, I went ahead and chose to install the `b43` driver, even though our card was not fully supported by Aircrack­-ng. The installation process was reasonably straight­forward, consisting of only a few steps. The first step was to download the driver/firmware installer. To do this, I used the command`:`

```
apt­-get install firmware­-b43-­installer
```

This command did the majority of the work getting the `b43` driver, it downloaded and put the files in the correct place. After performing that command, I went into our “Additional Drivers” properties and unchecked the active, proprietary drivers being used.

![Selecting the correct driver for aircrack compatibility](/wp-content/uploads/2022/09/driver-selection-1024x211.jpg)

**Selecting the correct driver**

This prompted a restart, and after booting back up, the driver was working properly.

### Patching Drivers

The next step to getting the drivers prepared for Aircrack-­ng is was to patch them. Driver patching is necessary for Aircrack­-ng to inject packets. Since our card does not support packet injection, I did not need to patch the driver. If you were to set up Aircrack­-ng yourself, the steps to patch the driver are still pretty simple. The patches provided by Aircrack­-ng usually are for only a specific version of the source code/driver and are not officially supported, so it is wise to back up your firmware files before making any changes or patching any files.

After downloading your driver, you must select the appropriate patch. The patches for Aircrack­-ng can be found at [https://patches.aircrack­-ng.org](https://patches.aircrack­-ng.org). Download the patch that corresponds to your driver and then move the downloaded `.patch` file to the directory of your firmware. In most cases in Ubuntu, the operating system that I am using, the firmware will be installed under the folder `/lib/firmware.` After the patch file is in the appropriate directory, open a terminal window, navigate to the directory, and use the command

```
patch -­Np0 -­i <patchfile.patch>
```

This will patch the necessary files if everything works out. If you would like to perform a test­-run of the patching to make sure that all will work, you can use the flag ­`**--dry­-run**` in the aforementioned command.

### Installing Aircrack-Ng

The final step to getting Aircrack­-ng working is to install Aircrack­-ng itself. This process can sometimes be tricky because of missing dependencies and the lackluster error reporting of the Aircrack­-ng installer. Our installation process went fairly smoothly.

The first thing I did was download the Aircrack­-ng source from the Aircrack­-ng website. I moved this compressed folder to the desktop, extracted it, and went into the extracted directory via the command line. After that, I followed the installation steps listed in \[1\]. This included running the command `**make**`. On the first attempt of running this command, I ran into this issue

```
common.mak:120: *** Cannot find development files for any supported version 
                    of libnl. install either libnl1 or libnl3.. Stop.
```

After reading over the error message, I looked up `libnl` and deduced that I needed to install it on our machine. I did so with the command

```
sudo apt­-get install libnl­-3-­dev libnl-­genl­-3­-dev. 
```

The installation of these libraries seemed to fix the first error that came up when performing the `make` command. Upon trying `make` again, I ran into another, more perplexing issue:

```
make ­-C src all

make[1]: Entering directory '/home/chandler/Desktop/aircrack/src' \
gcc ­-g -­W -­Wall -­O3 -­mavx -­DJOHN_AVX ­-pthread -­D_FILE_OFFSET_BITS=64 \
­-D_REVISION=0 -­DCONFIG_LIBNL30 ­DCONFIG_LIBNL ­-I/usr/include/libnl3 \
­-fstack­-protector-­strong ­-Wno­-unused­-but-­set­-variable ­-Wno-­array-­bounds ­-Iinclude \ 
­-DSIMD_CORE -­c ­-o aircrack-­ng.o aircrack-­ng.c

In file included from aircrack­ng.c:65:0:
crypto.h:43:26: fatal error: openssl/hmac.h: No such file or directory
compilation terminated.
<builtin>: recipe for target 'aircrack­ng.o' failed
make[1]: *** [aircrack­ng.o] Error 1
make[1]: Leaving directory '/home/chandler/Desktop/aircrack/src'
Makefile:25: recipe for target 'all' failed
make: *** [all] Error 2
```

From the log of running `make`, I extrapolated the issue: `crypto.h:43:26: fatal error: openssl/hmac.h: No such file or directory`. Not knowing exactly what was causing this, I looked up the error online. What was found is that I needed to install some SSL header files. I did so with the command

```
sudo apt-­get install libssl­-dev
```

After installing those SSL header files, I tried to `make` again, and it worked.

After successfully running the `**make**` command, it is instructed to perform the `**make install**` command. This was done successfully after elevating our user privileges, as the installation needed `sudo` access. At the end of the `**make install**` process, I was prompted with this message:

```
[*] Run 'airodump-­ng-­oui­-update' as root (or with sudo) to install or 
update Airodump­-ng OUI file (Internet connection required).
```

Following the prompt, I ran the **`airodump-­ng-­oui-­update`** command to update the Airodump-­ng OUI file. This was a recommended step in the installation instructions. The downloading and parsing of the file took a few minutes, but once it was complete, I was ready to start working with Aircrack­-ng.

## Using Aircrack-Ng

The Aircrack­-ng software suite is a pretty expansive set of tools. By default (without any third-party modifications), Aircrack­-ng runs solely in the terminal. This allows for very powerful usage and manipulation of information.

With Aircrack­-ng and wireless cracking in general, there are a few steps that are imperative to crack networks. Most techniques that will be covered later in this paper require these first steps. The first step is to scan, with your wireless card, your surrounding area. This scan will bring up all of the networks broadcasting in your vicinity. This process is called network sniffing. Every method requires this step, as you need to have a network to break into, to break into a network.

A second common step in cracking networks is to sniff for Initialization Vectors or IVs. IVs serve as a random or pseudorandom number that goes along with a secret key for data encryption, and in our case, network password encryption. The basic premise of sniffing IVs is that they are in the data packets that network users send and receive. They can either be weak or strong and depending on their strength, you can crack the network key faster (The higher the strength, the faster the cracking goes) \[1\].

Many other steps are used in cracking different security algorithms, which, I will cover in the specific sections about each algorithm.

### Network Sniffing with Airmon-Ng

Network sniffing is always the first step in finding a target network. There are a few steps with Aircrack­-ng to start sniffing for networks. The first step is to put your device into “Monitor mode” (also known as promiscuous mode). This allows your wireless card to read all packets being sent over WiFi.

To put our device into monitor mode, I first found our NIC’s (Network Interface Card) name. I did this with the command `**iwconfig**`

![Output from iwconfig ](/wp-content/uploads/2022/09/iwconfig-1024x250.jpg)

**Output from `iwconfig`**

The NIC’s name is found at the top left and is displayed (in our case) as `**wlp4s0b1**`.

Once I have the NIC’s name, I can start working with Airmon-­ng, Aircrack­-ng’s tool to put devices into monitor mode. **I** used the command

```
sudo airmon­-ng start wlp4s0b1
```

to do precisely that. Unfortunately, I ran into an issue when performing that command that didn’t allow us to put our card into monitor mode

```
Newly created monitor mode interface wlp4s0b1mon is *NOT* in monitor mode.
Removing non­monitor wlp4s0b1mon interface...
...
WARNING: unable to start monitor mode, please run "airmon-­ng check kill"
```

After searching online, I found that this was caused by the `NetworkManager` process running. I stopped that service with the command `**sudo service NetworkManager stop**`. After stopping the service, I was able to perform the `**sudo airmon­-ng start wlp4s0b1**` command successfully

![Screenshot of Airmon-Ng started](/wp-content/uploads/2022/09/airmon-start-1024x406.jpg)

**Started `Airmon-Ng`**

Turning the NetworkManager service off had the side effect of stopping network activity and not allowing the device to browse the internet. This can later be fixed by restarting the NetworkManager service.

After successfully performing the `airmon-­ng` command, I checked the status of our network card with the command `iwconfig`. This displayed that the card was in Monitor mode and that the name of the device was changed slightly from _wlp4s0b1_ to _wlp4s0b1**mon**​_. Once I had our device in Monitor mode, I moved on to the next step: sniffing for networks. I did this with the command 

```
sudo airodump-­ng wlp4s0b1mon
```

Airodump-­ng hops from one network channel to another and shows all access points that it can receive beacons from \[1\]

![Results from Airodump-ng Network Scan](/wp-content/uploads/2022/09/airodump-scan-1024x628.jpg)

**Results from `Airodump-ng` Network Scan**

The top section of the program shows all of the scanned networks, their BSSIDs, the signal strength (shown as PWR), the number of beacons sent, the channel that it’s on, its encryption type, cipher type, authentication type, and its ESSID or network name. The bottom half of the program shows clients (other computers) found talking to the networks. Shown are the BSSID and name/probe of the network, the station’s MAC address, and how many frames have been captured from it.

### Sniffing IVs with Airodump-Ng

Sniffing for initialization vectors is an important part of the cracking process and is made easy with Aircrack­-ng. Before trying to crack a network, it is recommended to sniff and obtain between 40,000 and 85,000 data packets of IVs (fewer if the strength of the IV packets is a lot)\[1\]. If the network that you are trying to crack is not very busy, this will take a long time. There are alternative options to speed up the process; however, these attacks need packet injection to be working to function properly.

To sniff for IVs, I used the same command that I used to sniff for networks, albeit with a few different flags. The basic syntax for it is as follows: 

```
sudo airodump­-ng -­c channel -​­­bssid BSSID -​­w dump​NIC_name​. 
```

**`Channel`** refers to the channel that the target network is operating on, `**BSSID**`​ refers to the MAC address of the target network, the `**-­w dump**` ​flag writes the captured IV packets to a file called _dump_, and **`NIC_name`** is your NIC’s name. Once you perform this command, a new window will come up showing the network and its information, as well as any clients that are connected. This command will capture IV packets and log them to a file.

![Results from Airodump-ng IV Scan](/wp-content/uploads/2022/09/airodump-iv-scan-1024x232.jpg)

**Results from `Airodump-ng` IV Scan**

Leave this program running until it has captured between 40,000 to 80,000 IV packets and then proceed to the cracking step.

### Cracking WiFi Passwords with Aircrack-ng

These first two steps outlined previously are two major components to cracking networks with Aircrack­-ng. These steps happen to be the first two in cracking WEP (with clients); however, In the following examples with different security algorithms, the cracking process is slightly different, and sniffing for IVs is sometimes done after additional steps.

### Hacking WEP with Clients

​The first two steps of sniffing for networks and sniffing for IVs on the target network are the beginning (and majority) of cracking a network that is secured by WEP which has clients. There is only one additional step.

Once you have captured a sufficient amount of IVs from a network, you can proceed to try and crack the network key. This is done with the following command: 

```
sudo aircrack­-ng -­b BSSID ​dump­file.cap​
```

**`BSSID`** ​is the MAC address of the target network and `**dump­file.cap**` ​is the file that is generated while sniffing for IVs. Performing this command will test the network keys.

![WEP Wi-Fi Password Key Cracked](/wp-content/uploads/2022/09/wep-key-cracked-1024x402.jpg)

**WEP Wi-Fi Password Key Cracked**

### Active Attacks on WEP and WPA

​Active attacks are where Aircrack­-ng shines. These attacks rely on packet injection to do their work and are extremely powerful in cracking networks and vastly speeding up the process. There are a few main features that Aircrack­-ng has that rely on packet injection and are included in aireplay­-ng. Aireplay-­ng is used to inject frames and to generate traffic for later use in Aircrack­-ng for cracking WEP and WPA­-PSK keys \[9\]. There are 10 implemented attack methods built into aireplay, more can be read about so at \[9\].

Both WEP and WPA keys can be cracked easier using active attacks and aireplay-­ng. WEP keys can be cracked easier using a combination of ARP replay and ARP request reinjection. Unfortunately, I was unable to play with these attack methods because of our wireless card’s lack of compatibility with packet injection.

### Hacking WPA2 with Aireplay-Ng

WPA2 is a common network security algorithm that is much more secure than WEP. Cracking WPA2 networks always involve packet injection and some tricky methods. The first two steps are the same as WEP cracking, sniffing a network, and scanning for IVs. After that step, there is some variance. When cracking WPA2, one method is to try to de-authenticate a client to make them reauthenticate again (automatically as a functionality built into the operating system). This is so I can capture the encrypted password of the network \[6\].

To de-authenticate someone against their AP, I can use a function built into aireplay­ng. 

```
aireplay­-ng --­­deauth 100 ​­-a BSSID NIC_Name​
```

Where 100 is the number of de-authenticate frames that you want to send. This is a packet­-injection method, and an example of the output is shown below:

![De-authenticating a user on a WPA2 Network](/wp-content/uploads/2022/09/wpa2-deauth-1024x435.jpg)

**De-authenticating a user on a WPA2 Network**

After de-authenticating the client, the client will automatically try to reauthenticate itself. During this time, we will capture the handshake between the client and the AP. Running `airodump-­ng` during the process of de-authenticating, the client will automatically catch the WPA handshake (and write it to a file if ran as described previously).

Once the WPA handshake has been captured, we can try to brute-force the password with Aircrack­-ng using the command:

```
aircrack­-ng WPAhandshakeFile.cap ­-w /path/to/wordlist
```

Where the `**.**`**`cap`** file is the file written to by airodump-­ng and the **wordlist** is a list of words in a file that could be possible passwords. This cracking method can be a relatively slow and tedious process, taking up days or longer if the AP’s password is very secure. On the other hand, it can take seconds on powerful hardware with a weak to medium-strength password. See an example of this password cracking process below:

![Cracking a WPA2-PSK Key with a Wordlist](/wp-content/uploads/2022/09/wpa2-crack-1024x587.jpg)

**Cracking a WPA2-PSK Key with a Wordlist**

## References

\[1\] “[Aircrack­-ng Newbie Guide for Linux](https://www.aircrack-ng.org/doku.php?id=newbie_guide).” Aircrack­-ng. Web. 1 Mar. 2016.

\[2\] “[Aircrack­-ng compatible drivers](https://www.aircrack-ng.org/doku.php?id=compatibility_drivers)” Aircrack­-ng. Web. 1 Mar. 2016

\[3\] “[B43 driver](https://www.aircrack-ng.org/doku.php?id=b43).” Linux Wireless. Web. 1 Mar. 2016

\[4\] “[Airmon­ng](https://www.aircrack-ng.org/doku.php?id=airmon-ng).” Aircrack­-ng. Web. 1 Mar. 2016

\[5\] “[WEP Wireless Security](https://kb.netgear.com/1141/What-is-WEP-wireless-encryption).” Netgear. Web. 1 Mar. 2016.

\[6\] “[How to Hack Wi­Fi: Cracking WPA2­PSK Passwords Using Aircrack­-ng.](https://null-byte.wonderhowto.com/how-to/hack-wi-fi-cracking-wpa2-psk-passwords-using-aircrack-ng-0148366/)” WonderHowTo. Web. 1 Mar. 2016

\[7\] “[How to crack WEP with no wireless clients](https://www.aircrack-ng.org/doku.php?id=how_to_crack_wep_with_no_clients).” Aircrack­-ng. Web. 1 Mar. 2016

\[8\] “[How to do shared key fake authentication](https://www.aircrack-ng.org/doku.php?id=shared_key) ” Aircrack­-ng. Web. 1 Mar. 2016

\[9\] “[Aireplay­ng](https://www.aircrack-ng.org/doku.php?id=aireplay-ng).” Aircrack­-ng. Web. 1 Mar. 2016
