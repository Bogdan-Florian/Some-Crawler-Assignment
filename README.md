# App summary
=>My application receives a 'start' command through an endpoint 

= >iterates through the CSV and pushes work to a Redis Queue

=> Consumer receives URL and navigates to website

=> We search href's for the contact page(best bang for your buck to find all data points)

=> Navigates to contact and searches for data

=>  Sanitises phone number and inserts it into database

=> Provides a REST endpoint to see stored indexes.


# What I've added

- A single search strategy to scrape phone numbers using **Regex**
- Inserted all CSV inside **ES database**
- Navigation to domains using puppeteer and a way to find contact page => navigate to it and attempt scraping from there
- Implemented an endpoint **/start?limit=5** that takes as query how many rows to take from the CSV and produce tasks inside **Redis Queue** 
- Created a consumer that pulls from Queue and does the crawling/scrapign
- Added a REST endpoint **/company?companyDomain=[domain_name]** to retrieve the whole record
- bare minimum Dockerfile 

# Things I couldn't finish in time
- I haven't implemented strategies for extracting the rest of data points. I think that it would have gone along the same lines as I did extracting the phone number.
- No Docker/Kubernetes thus I can't make a guess if I'm under 10 minutes or not 

# Why and How I did things(Reasoning)
I decided to implement all tasks as a whole app in the following order:
Scraping -> Crawling -> Database insertions/manipulations -> REST API -> App virtualization

I remember hearing that Veridion uses multiple strategies of extracting data so I attempted in the initial phases a 'strategy pattern' 

Architecture of strategy pattern:
- 
- Define multiple(2-3) ways of extracting each individual piece of data
- Create an 'Manager' that holds each strategy and calls at appropriate times
- Use manager to handle internal calls to different procedures of extraction
- Collect all data and determine which strategy was better

*In the end I removed a layer of abstraction because we had only 1 strategy thus no reason to over complicate the code at this point*

How to crawl 1000 under 10:
-
- First I modularized my solution because I had the following independent pieces: The express.js app, crawler/scraper/ database connection.
- I understood that each **Kubernetes** pod has to ingest from the Queue a URL independently of other processes. 
- As far as I know at this point the pods can share the same database connection so there was no reason to plan for using docker the database too. 

Things I would do better next time:
-
- Introduce TypeScript, I am coming from a statically typed background and Its easy to get confused what parameters a method takes. 
- Research beforehand Regex performance before thinking it's the right solution
- Use a library that takes away the complexity of parsing a string
- Implement Docker from the beginning and produce incremental changes that can be verified in that environment. At this point it would take a couple of hours of debugging why X can't connect to Y within Docker.  

How would you store a dataset to allow querying by company name?
- 
- The primary field is company name of type text if we're doing full-text searches or keyword for sorting, exact value finding.

- We can store it inside a single index and use nested data for other piece of data related. If the data changes quite often we could store other datasets related to the company in separate locations.

- Another thing that impact the way we store it is how this dataset is going to be queried, e.g term or match

- If scalling on this dataset then our strategies have to take into account how it will impact sharding thus we need to think of how large the dataset will grow. 

*How to run:
Run npm install, install Redis, Elastic Search. 
consumer.js needs to be ran separately
entry point is index.js for main app.*
