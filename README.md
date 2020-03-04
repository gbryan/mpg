# Vehicle Fuel Efficiency and CO2 Emissions Comparison Calculator

## What is it?

This calculator is a learning project that I completed to build on my React skills.
It grew out of my interest in answering two questions:

1. Which car would be most cost-effective to purchase when considering cumulative fuel cost over
the car's lifetime? For example, would it be cheaper to buy the car with a low sticker price but
relatively low gas mileage, or would the more expensive car with higher gas mileage be cheaper
over the lifetime of the car?
2. What is the relative level of carbon dioxide emissions of one vehicle vs. another?

This tool helps answer both questions. Just select vehicles to compare, enter the
purchase price of the vehicles, optionally modify other assumptions, and check out
the chart showing fuel cost and CO₂ emissions over time.

## Where is it hosted?

(It's currently a WIP.)

See [https://stage.mpgcompare.com](https://stage.mpgcompare.com).

## Technical Overview

* The frontend is a single-page React app build from create-react-app.
* I chose [react-charts](https://www.npmjs.com/package/react-charts) for the chart library and used
[CSS modules](https://github.com/css-modules/css-modules) for styling.
* The backend is a simple Node.js + Express app that uses MySQL as the data store.
* The project is hosted on a Kubernetes cluster that I set up because of an interest to learn
more about how to set it up from scratch. If this were a high-traffic project, I'd definitely
do some things differently in how it's set up.

## Deployment

Prod: `make build-prod && make deploy-prod`

Stage: `make build-stage && make deploy-stage`

## TODO

See a partial list [here](https://github.com/gbryan/mpg/blob/master/frontend/src/App.js#L15).
