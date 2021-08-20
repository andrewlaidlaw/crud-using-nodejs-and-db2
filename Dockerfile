FROM ppc64le/centos:7

# runtime support to enable npm build capabilities
RUN yum -y install libstdc++ make gcc-c++ numactl-devel

# XLC runtime support - required by ibm_db node package
RUN curl -sL http://public.dhe.ibm.com/software/server/POWER/Linux/xl-compiler/eval/ppc64le/rhel7/ibm-xl-compiler-eval.repo > /etc/yum.repos.d/xl-compilers.repo \
        && yum -y install libxlc
        
#install most up-to-date LTS node for ppc64le
RUN cd /usr/local \
        && curl -sL https://nodejs.org/dist/v14.17.5/node-v14.17.5-linux-ppc64le.tar.gz > node-v14.17.5-linux-ppc64le.tar.gz \
        && tar --strip-components 1 -xf node-v14.17.5-linux-ppc64le.tar.gz

COPY package*.json ./
RUN npm install

COPY server.js .
# COPY .env .

EXPOSE 8080

CMD [ "node", "server.js" ]