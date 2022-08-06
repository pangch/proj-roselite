# proj-roselite

## WebRPC Playground

For learning and testing WebRPC only. This repo implements a basic chatroom with some video calling capabilities.

## Notes

### Development

Run `docker-compose up` to launch the appserver container. Then attach to the app server container and run `npm run build` to generate static web client files.

### Production

Run `docker-compose -y docker-compose.prod.yml up` to build and run a prod version of the appserver with nginx and certbot. This would allow running the website with SSL, without which browsers would not enable most media capabilities.

#### SSL certs

Generate dhparam certs

```
sudo mkdir -p ./system/dhparam && openssl dhparam -out ./system/dhparam/dhparam-2048.pem 2048
```

## References

- [How To Secure a Containerized Node.js Application with Nginx, Let's Encrypt, and Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-secure-a-containerized-node-js-application-with-nginx-let-s-encrypt-and-docker-compose)
