# fragments

Cloud Computing for Programmers Repo<br>

**Scripts to Remember**<br>
npm start - runs the server normally.<br>
npm run dev - restarts the server when ever a change is made inside the src folder.<br>
npm run debug - used as the default Debug method for the project in VSCode.<br>
npm run lint - checks for any errors present that need to be addressed.<br>
git push --tags git@github.com:connor-seneca/fragments.git<br>
<br>
**Connect into aws ec2 instance**<br>
ssh located in /home/$USER<br>
ssh -i {ssh-key-path} ec2-user@{aws-dns-server}<br>

**Docker CMDs**<br>
#build a docker image to be ran<br>
docker build -t fragments:latest .<br>
#creater docker container -it allows interaction in the cmd line (CTRL-C to close container)<br>
docker run --rm --name fragments --env-file .env -it fragments:latest<br>
#creates a detached docker instance<br>
docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 -d fragments:latest
