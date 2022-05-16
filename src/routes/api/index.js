import clientPromise from '../../lib/db-client';

export async function post({request}) {
  let body = await request.json();
  console.log(body);
  try {
    const dbConnection = await clientPromise;
    const db = dbConnection.db("TinyTown");
    const collection = db.collection('ComfyDefault');
    let nameCheck = await collection.findOne({key: body.username});
    console.log('below');
    console.log(nameCheck);
    if (!nameCheck){
      await collection.insertOne({
        'key': body.username,
        "data": [body.number]
      })
      return {
        status: 200,
        body:{
          works:true,
          first: true,
        }
      }
    } else {
      if (nameCheck.data.includes(body.number)){
        return {
          status:200,
          body:{
            works:true
          }
        }
      }
      await collection.updateOne({key: body.username}, {$push: {data:body.number}}, (err, res) => console.log(`${body.username} updated!`))
      return {
        status:200,
        body:{
          works:true
        }
      }
    }
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      body: {
        error: err,
      }
    }
  }
}