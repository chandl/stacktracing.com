---
title: "Breaking Down the Real Time Streaming Protocol (RTSP) [RFC 2326]"
date: 2022-08-21
description: "Real Time Streaming Protocol (RTSP) - the protocol used for playing, pausing, and stopping all of your favorite media. Learn how it works behind the scenes..."
image: "/wp-content/uploads/2022/08/Violet-and-White-Simple-Bold-Business-Promo-LinkedIn-Article-Cover-Image-1.jpg"
wpPath: "/real-time-streaming-protocol/"
---

Have you ever been watching a video online and wondered how all of the components work together? More specifically, have you wondered how the player knows when you stopped or paused the video or how the video gets set up in the background? While different websites and platforms use a range of streaming protocols to assist with this functionality, one of the first and most influential is RTSP or the Real Time Streaming Protocol.

## RTSP Overview

The Real Time Streaming Protocol is a network control protocol on the application level which provides control over the delivery of real-time, on-demand data (e.g. Video/Audio streams). RTSP follows a client-server model and can run over both UDP, multicast UDP, and TCP (The IESG, 1998, n.p). It establishes, configures, and controls a single or several time-synchronized streams of media.

Typically, RTSP does not deliver the continuous media streams itself, as that is often delegated to other protocols such as RTP, RTCP, and other proprietary protocols; however, the operation of RTSP does not depend on the transport mechanism used (Schulzrinne, Rao, & Lanphier, 1998, n.p.). Basically, this protocol allows clients to interact with a media server, issuing different directives to control and configure a media stream(Schulzrinne, Rao, & Lanphier, 1998, n.p.).

### History

RTSP has been around since 1996 when it was first proposed by Dr. Henning Schulzrinne at Columbia University as RTSP’ (RTSP Prime). Schulzrinne based RTSP off of RTSP-00, a prior iteration of the protocol that was developed by Netscape and Real Networks and presented to the Multiparty Multimedia Session Control Working Group(MMUSIC WG), an affiliate of the Internet Engineering Task Force (IETF)(Schulzrinne, A real-time, 1996, n.p.). Interestingly enough, both RTSP-00 and RTSP’ were presented at the San Jose IETF in January of 1996, but RTSP-00 was not continued, as Schulzrinne’s modifications were more consistent with the ongoing IETF efforts at the time, SIP and HTTP (Schulzrinne, Rao, & Lanphier, 1998, n.p.).

At the time, Schulzrinne, Real Networks, and Netscape agreed to work together to produce a merged RTSP spec (The IESG, 1998, n.p). This ‘merged’ spec was presented at the Memphis IETF, Munich IETF, and further discussed until November of 1997, when the remaining minor issues were worked out. Finally, in 1998, MMUSIC WG standardized and published RTSP as RFC 2326 (RFC2326, 1998, n.p.). Recently, in 2016, RTSP 2.0 was introduced and published as RFC 7826 as a replacement for RTSP 1.0 (RFC7826, 2016, n.p.).

### RTSP Features

The RTSP protocol is similar in syntax and operation to HTTP/1.1, so extension mechanisms to HTTP can (in most cases) be added to RTSP. On the other hand, RTSP differs in regards to HTTP because of a few aspects. First, RTSP introduces many new methods (directives) and it has a different protocol identifier (i.e. \`rtsp://\` instead of \`http://\`). Second, unlike HTTP, RTSP requires keeping track of a state; usually, as an identifier to track concurrent sessions (Schulzrinne, Rao, & Lanphier, 1998, n.p.).

One thing to note is that there is no such notion of an RTSP connection and an RTSP session is in no way tied to a transport-level connection such as a TCP connection. During an RTSP session, a client may open and close many TCP/UDP connections to the server to issue RTSP requests. Finally, unlike HTTP, both an RTSP server and client can issue requests (Schulzrinne, Rao, & Lanphier, 1998, n.p.).

#### Key Operations

There are a few key operations that RTSP supports that make the protocol especially useful. The first is the retrieval of media from a media server. Clients are able to request a presentation description via HTTP, which contains the information about the stream, and then play the media. Second, a media server can be “invited” to join a multiparty, multimedia presentation, either to playback or record media. This feature was very useful in its time and was even intended for distributed teaching applications. Finally, RTSP can inform clients about additional media becoming available (Schulzrinne, Rao, & Lanphier, 1998, n.p.).

#### RTSP Properties

The RTSP protocol has many properties: it is extendable, easy to parse, secure, and transport-independent. This means that new methods and parameters can easily be added, it can be parsed by standard HTTP or MIME parsers, it re-uses security mechanisms, either at the transport level (e.g. TLS) or within the protocol itself, and it may use either reliable or unreliable transport methods (UDP & TCP). In addition, RTSP is multi-server capable, presentation description neutral, and HTTP-friendly.

Its multi-server capability means that each media stream (e.g. audio & video) can reside on a different server, where the client automatically establishes several concurrent control sessions with the separate servers, and synchronization is performed at the transport level (Schulzrinne, Rao, & Lanphier, 1998, n.p.). Since RTSP is presentation description neutral, it does not impose a particular presentation description/format and it does not convey the type of format to be used. RTSP’s HTTP-friendly property means that RTSP reuses HTTP concepts so the existing infrastructure can be reused.

### RTSP Directives

RTSP defines a set of methods, or directives, to be used to control media streams. Many of the directives do not contribute directly to the state of the media, but there are a few directives that are crucial and play a central role in defining the allocation and usage of stream resources on the server: DESCRIBE, OPTIONS, SETUP, PLAY, PAUSE, and TEARDOWN (Schulzrinne, Rao, & Lanphier, 1998, n.p.). We will discuss these further, but provide a cursory overview of the other directives.

### Setting up the RTSP Stream

#### OPTIONS

Since not all media servers have the same functionality, some media servers will support different sets of requests. For example, a server that is only capable of playback would not need to keep the RECORD request, or a server that is playing live media would not be capable of seeking (Schulzrinne, Rao, & Lanphier, 1998, n.p.). In order to find out what a server supports, a client will issue an OPTIONS request to receive the server’s supported directives. See the table below for the different directives, how they operate (client to server, server to client), what they operate on (presentation or stream), and if they are required.

<table><tbody><tr><td><strong>Method</strong></td><td><strong>Direction</strong></td><td><strong>Object</strong></td><td><strong>Requirement</strong></td></tr><tr><td>DESCRIBE</td><td>C→S</td><td>P,S</td><td>recommended</td></tr><tr><td>ANNOUNCE</td><td>C→S, S→C</td><td>P,S</td><td>optional</td></tr><tr><td>GET_PARAMETER</td><td>C→S, S→C</td><td>P,S</td><td>optional</td></tr><tr><td>OPTIONS</td><td>C→S, S→C</td><td>P,S</td><td>required (S→C is optional)</td></tr><tr><td>PAUSE</td><td>C→S</td><td>P,S</td><td>recommended</td></tr><tr><td>PLAY</td><td>C→S</td><td>P,S</td><td>required</td></tr><tr><td>RECORD</td><td>C→S</td><td>P,S</td><td>optional</td></tr><tr><td>REDIRECT</td><td>S→C</td><td>P,S</td><td>optional</td></tr><tr><td>SETUP</td><td>C→S</td><td>P,S</td><td>required</td></tr><tr><td>SET_PARAMETER</td><td>C→S, S→C</td><td>S</td><td>optional</td></tr><tr><td>TEARDOWN</td><td>C→S</td><td>P,S</td><td>required</td></tr></tbody></table>

Overview of RTSP methods, their direction, what they operate on (P: Presentation, S: Stream), and if they are required. (Schulzrinne, Rao, & Lanphier, 1998, n.p.)

#### DESCRIBE

The DESCRIBE directive retrieves the session/presentation description or media object that is identified by the request URL from a server. The DESCRIBE reply-response pair constitutes the initialization phase of RTSP, effectively the first step in setting up the stream. The client may use the Accept header to specify description formats that they understand and the server responds with a description of the requested resource (Schulzrinne, Rao, & Lanphier, 1998, n.p.). The description will often come via an SDP (Session Description Protocol) description wrapped in RTSP. See the figure below, an RTSP DESCRIBE request-response pair.  

![](/wp-content/uploads/2022/08/describe-1024x682.jpeg)

DESCRIBE request-response pair.

#### SETUP

media. A client can issue a SETUP request while the stream is already playing to change transport parameters, which a server might allow. This directive finalizes the setup of the stream and is often the last one called before the PLAY directive. RTSP SETUP data is often used by firewalls and other intermediate network devices to configure internal settings based on the transport mechanism specified. The Transport header from the client specifies the acceptable transport methods of the client, and the response will contain the transport parameters selected by the server (Schulzrinne, Rao, & Lanphier, 1998, n.p.). See the figure below, an RTSP SETUP request-response pair.

![](/wp-content/uploads/2022/08/setup-1024x356.jpeg)

SETUP request-response pair

### RTSP Media Control Directives

#### PLAY

The PLAY directive tells the server to start sending data via the transport protocol specified in the SETUP response. PLAY requests cannot be issued while any SETUP request is outstanding (i.e. not acknowledged as successful). PLAY requests are queued on the server and are executed in order. In the PLAY request, a Range is specified, that is when the media should start and stop playing (Schulzrinne, Rao, & Lanphier, 1998, n.p.). This parameter is not always required, and if not found, the media will play directly from start to end, and in the case of live streams, start from the most recent time. See the figure below, an RTSP PLAY request-response pair.

![](/wp-content/uploads/2022/08/rtsp-play-request-1024x343.jpeg)

PLAY request-response pair

#### PAUSE

The PAUSE directive is another essential method used to control the media stream. A PAUSE request causes the stream delivery to be halted temporarily. The request URL can name either a stream, where only playback of that stream is halted. For example, if an audio stream is named in the request URL, only the audio stream will be paused (i.e. muted). The request URL can also name a presentation or group of streams to halt delivery of all of the currently active streams within the presentation. After pausing, the server may close the session if the timeout interval (described in the SETUP response) is exceeded (Schulzrinne, Rao, & Lanphier, 1998, n.p.).

Similar to the PLAY directive, PAUSE requests can contain a Range header specifying the “pause point”. This Range must contain exactly one value rather than a time range. The normal play time for the stream is set to the pause point and is continued at this point when a PLAY request is received. See the figure below, a PAUSE directive request-response pair.

![](/wp-content/uploads/2022/08/rtsp-pause-request-1024x279.jpeg)

PAUSE request-response pair

#### TEARDOWN

The TEARDOWN directive is the last major directive in the RTSP protocol. The TEARDOWN directive is used to stop the stream delivery. Specifically, it stops the stream delivery for the given URI, freeing the resources on the server associated with it. In the request body, the Session that was assigned upon calling SETUP is supplied; causing the server to invalidate the session. Unless the session description defines all transport parameters, a new SETUP request has to be issued before the session can be played again (Schulzrinne, Rao, & Lanphier, 1998, n.p.). See the figure below, a TEARDOWN directive request. The response is not included, as it is just an acknowledgment.

![](/wp-content/uploads/2022/08/rtsp-teardown-request-1024x125.jpeg)

TEARDOWN request-response pair

### Other RTSP Directives

As mentioned previously, there are a few less-important RTSP directives. These include GET\_PARAMETER, SET\_PARAMETER, ANNOUNCE, REDIRECT, and RECORD. See the table below which describes the basic functionality of each directive.

<table><tbody><tr><td>Directive</td><td>Description</td></tr><tr><td>GET_PARAMETER</td><td>Retrieves the value of a parameter specified in the request URI. The reply/response is left to the program’s implementation. This allows RTSP to be extensible.</td></tr><tr><td>SET_PARAMETER</td><td>Sets the value of a parameter specified in the request URI.</td></tr><tr><td>ANNOUNCE</td><td>Serves two purposes. From client to server, it posts the description of a presentation or media object to the server. From server to client, it updates the session description in real time.</td></tr><tr><td>REDIRECT</td><td>Informs the client that it must connect to another server location.</td></tr><tr><td>RECORD</td><td>Initiates recording of a range of media according to the presentation description.</td></tr></tbody></table>

Basic description of the other directives’ functionality (Schulzrinne, Rao, & Lanphier, 1998, n.p.).

## Conclusion

RTSP or the Real Time Streaming Protocol is an application-level protocol to control the delivery of real-time data. It was first proposed in 1996 by a Computer Science professor at Columbia University and was finalized in April of 1998 when it was published by the Multiparty Multimedia Session Control Working Group in affiliation with the IETF as RFC 2326. RTSP has many applications in regard to multimedia streaming, but it is starting to be phased out in preference for newer technologies, such as RTSP 2.0 and other stateless protocols. RTSP shaped the way in the early days of networking for multimedia streaming and will leave an everlasting impact on the field.

### References

The IESG, & RFC Editor. (1998, February 6). Protocol Action: Real Time Streaming Protocol (RTSP) to Proposed Standard \[Email\]. Multiparty Multimedia Session Control Working Group. [http://www.cs.columbia.edu/~hgs/rtsp/proposed.txt](http://www.cs.columbia.edu/~hgs/rtsp/proposed.txt)

RFC2326 Real Time Streaming Protocol (RTSP). H. Schulzrinne, A. Rao, R. Lanphier. April 1998. (Format: TXT=195010 bytes) (Obsoleted by RFC7826) (Status: PROPOSED STANDARD) (DOI: 10.17487/RFC2326)

Schulzrinne, H. (1996, November 26). A real-time stream control protocol (RTSP') \[Internet-Draft\]. Internet Engineering Task Force. [http://www.cs.columbia.edu/~hgs/rtsp/draft/draft-ietf-mmusic-stream-00.txt](http://www.cs.columbia.edu/~hgs/rtsp/draft/draft-ietf-mmusic-stream-00.txt)

Schulzrinne, H., Rao, A., & Lanphier, R. (1998, February 2). Real-Time Streaming Protocol (RTSP) \[PDF\]. Internet Engineering Task Force. [http://www.cs.columbia.edu/~hgs/rtsp/draft/draft-ietf-mmusic-rtsp-09.pdf](http://www.cs.columbia.edu/~hgs/rtsp/draft/draft-ietf-mmusic-rtsp-09.pdf)
