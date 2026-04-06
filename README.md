## Secure Notes

This is an application for Storing your Password, Notes and important Data such as personal Information and Sensitive data.

All the Data inside this Application is secured and protected with password.

No Database Connectivity to eliminate the change of being data leaked And secured with Encryption.

Session based accessed to the Notes and Password. Main Purpose is to make the data as secure as much possible.

![Project Info](/home/rajuy/Pictures/Project_Notes.png "Project")

## Project Complexity

**Easy-Medium**

## Starting Date

On March 21, 2026 - Estimated Time to Complete This project is One Month [ April 21 Expected]

## Member

1. [Raju Yadav](https://github.com/raju-07 "Visit Github Profile")
2. [Prachi Jaswal](https://github.com/prachi-jaswal "Visit Github Profile")
3. [Raja Singh Rajpoot](https://github.com/rajasinghrajpoot "Visit Github Profile")

## Features

#### App Lock

    we've implemented the expo-local-authentical with this application which allow you to lock the Secure-Notes Applicaiton. It works with fringerprint,pin,pattern,password or even with face lock which is the first layer of security, keeping the other person away from you private stuff.

    We added the Timout to lock the application which is:

* **instantly** as soon as you close the application it'll lock the applicaiton
* **15 Seconds**
* **1 Minute**
* **5 Minutes**

#### Session

    We integrate the session based access in this applicaiton which forces the app to lock after a fixed period of total usage, even if you are actively using it.
it is integrated to make your personal notes, password and other items stay safe. there's one posibility that after using the applicaiton sometimes we didn't closed it so it remains accessible for entire time where App locks doesn't work as the application never closed so to make it more secure we add this feature where it'll automatically close the application and this is our 2nd layer of security.

**AutoLock session Length**

* 30 Minutes
* 1 Hour
* 2 Hours
* 4 Hours

Hope you like it. 

#### Encryption

We've implemented Encryption with **AES-256-GCM**.

**AES-256-GCM:** The Advanced Encryption Standard with a 256-bit key. It is considered "bank-grade" security. AS it supports 256 bit encryption 'expo-secure-store' has it limits of 2040 KB, which is very sufficient for storing the text information but for image it's a bit challenging to store high defination picutre in it.

Also Introduced a limit tracking bar in the 'Settings>Encryption'.

One another feature is "**Brute Force**"  when it's *active ,* if authentication failed for 5 times then all the Stored Data will be erased so only '**active**' it on your Risk.
