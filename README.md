# Google Analytics Proxy

Google Analytics Proxy (GAP) provides a Proxy Service to Google's [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/) and a replacement for Google Analytic's 
client-side JavaScript ([analytics.js](https://developers.google.com/analytics/devguides/collection/analyticsjs/))
to increase privacy and help prevent possible data leakage.

To minimize implementation changes, GAP attempts to mirror syntax from _analytics.js_.
 
The proxy service is intended to be run as an [AWS Lambda](https://aws.amazon.com/lambda/).

## Technologies

  - [AWS Lambda](https://aws.amazon.com/lambda/) - The service will serve as an AWS Lambda instance.
  - [aws-serverless-express](https://github.com/awslabs/aws-serverless-express) - The server is built with ExpressJS with the npm module specifically for AWS Lambda.


## Installation of Proxy Service

Clone the repo. Open your terminal and in the folder you just downloaded, run 
```sh
$ npm install
```

### Start the service
To execute the service locally, run 
```sh
$ npm start
```
The server will be executed on _localhost:3001_.

## Usage

To use GAP on a web page, load the client-side JavaScript from the Proxy Service:
 

```javascript
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsProxyObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://xxx.org/javascript/gaproxy.js','gap');

gap('create', 'UA-XXXXX-Y', 'auto');
gap('send', 'pageview');
</script>
```

The code should be added near the top of the `<head>` tag with the string `'UA-XXXXX-Y'`.
 
- Replace _UA-XXXXX-Y_  of the Google Analytics property you wish to track.
- Replace _xxx.org_  with the location of your GAP client-side JavaScript.
- Optionally, replace _auto_  with a cookie fields object (see below). 

Adding this code will load GAP and track the current pageview.

### Specifying Cookie Fields

To optionally control how the client-side cookie is set, pass a cookie fields object:

```javascript
gap('create', 'UA-XXXXX-Y', {
  clientId: '76c24efd-ec42-492a-92df-c62cfd4540a3',
  cookieDomain: 'example.org',
  cookieExpires: 60 * 60 * 24  // Time in seconds (1 day)
});
```

### Initializing GAP Parameters

You can optionally specify GAP parameters:

```javascript
gap('init', 'MetricNameSpace');
```

- Replace _MetricNameSpace_ with the namespace to be used for metrics.
- Replace _123456-abcde-123456-abcde_ with a Client ID. If a Client ID is not specified, it will 
be randomly generated.



### Tracking Page Views

Pageview hits can be sent using the send command and specifying a hitType of pageview. The send command has the following signature for the pageview hit type:

```javascript
gap('send', 'pageview', [page], [fieldsObject]);
```

Documentation for additional pageview parameters is available from the
[analytics.js documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/pages). 

### Tracking Events

Event hits can be sent using the send command and specifying a hitType of event. The send command has the following signature for the event hit type:

```javascript
gap('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
```
Documentation for additional event parameters is available from the
[analytics.js documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/events). 


## Deployment

To deploy the service as an AWS Lambda instance, in the root of the folder, create a file named ".env". Follow the format below,

```sh
AWS_ENVIRONMENT=[the environment you want]
AWS_ACCESS_KEY_ID=[your access key]
AWS_SECRET_ACCESS_KEY=[your access key secret]
AWS_PROFILE=
AWS_SESSION_TOKEN=
AWS_ROLE_ARN=[your lambda instance role]
AWS_REGION=[your lambda region]
AWS_FUNCTION_NAME=
AWS_HANDLER=index.handler
AWS_MEMORY_SIZE=128
AWS_TIMEOUT=3
AWS_DESCRIPTION=
AWS_RUNTIME=nodejs4.3
AWS_VPC_SUBNETS=
AWS_VPC_SECURITY_GROUPS=
EXCLUDE_GLOBS="event.json"
PACKAGE_DIRECTORY=build
```

To get your AWS Lambda service credentials, please visit [AWS Lambda's website](https://aws.amazon.com/lambda/).

Then run:

```
node-lambda deploy --functionName googleAnalyticsProxy --environment development --configFile deploy.env
```

It will deploy your server as a Lambda instance to your AWS account.