import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express application
  const app = express(); 
  //default port to listen
  const port = 8082; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  // Get a greeting to a specific person 
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let { name } = req.query;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  app.get("/cars", async(req: Request, res: Response) => {
    let {make} = req.query;

    if(!make)
    {
      return res.status(400).send('make is required');
    }
    let filteredCars = cars.filter(function(currentCar:Car) {
      return currentCar.make.toLowerCase() == make.toString().toLowerCase();
    });
    return res.status(200).send(filteredCars);
  });

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/cars/:id", async(req: Request, res: Response) => {
    let {id} = req.params;

    if(!id)
    {
      return res.status(400).send('Id is required');
    }

    let idNum = Number(id);
    if(isNaN(idNum))
    {
      return res.status(400).send('Id should be a number');
    }

    let requestedCar = cars.find(function(currentCar)
    {
      return currentCar.id == idNum;
    });

    if(!requestedCar)
    {
      return res.status(404).send('Requested car not found');
    }

    return res.status(200).send(requestedCar);
  });

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post("/cars/add", async(req:Request, res:Response) => {
    const newCar = req.body as Car;

    let missingField : string = "";
    if(!newCar.id)
    {
      missingField = 'id';
    }

    if(!newCar.make)
    {
      missingField += 'make ';
    }

    if(!newCar.model)
    {
      missingField += 'model ';
    }

    if(!newCar.type)
    {
      missingField += 'type ';
    }

    if(!newCar.cost)
    {
      missingField += 'cost ';
    }

    if(missingField != "")
    {
      return res.status(400).send('Missing fields: ' + missingField);
    }

    let existingCar = cars.find(function(currentCar)
    {
      return currentCar.id == newCar.id;
    });

    if(!existingCar)
    {
      cars.push(newCar);
    }
    else
    {
      return res.status(400).send('Id already exists');
    }

    return res.status(201).send(newCar);
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
