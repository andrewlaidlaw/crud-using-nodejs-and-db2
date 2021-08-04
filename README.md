# An application to read data from a remote IBM Db2 database
This has been tested with a remote Db2 database running on an AIX system hosted in the IBM CECC. It is part of a wider demo looking at connecting new OpenShift based Cloud applications to data stored in on-premises systems.

## Usage
This application presents a number of API endpoints over http to read data from a Db2 database. By default it listens on port 8888.

Host details and user credentials are stored in a local `.env` file as variables.

The data to use comes from the sample dataset available with the Db2 installer, which includes small scale tables of data based on common business data.

## Endpoints
`/getProducts` provides a JSON object where `data` is an array of products with relevant information.

`/getEmployees` provides a JSON objcet where `data` is an array of employees with limited information.

`/getEmployee` expects an input value of `id` which is the employee number. It then returns the full information record of that employee in the `data` component of the returned JSON object.