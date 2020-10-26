1. create file .env
2. install package -> npm i
3. docker build image: docker build -t auth-server:1.0 .
4. export docker image: docker save -o ./auth-server-image.tar auth-server:1.0
5. load to remote: scp auth-server-image.tar root@10.14.107.5:/root/vcb
6. import to docker of remote: docker load -i ~/vcb/auth-server-image.tar
7. run: docker run -p 4444:4444 —name auth-container auth-server:1.0
8. test: http://localhost:4444
