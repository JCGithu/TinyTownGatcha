import clientPromise from '$lib/db-client';
import houseData from "$lib/allHouses.json";

async function pickHomes(userData){
  console.log('running pick homes');
  return new Promise((res)=>{
    let listOfHomes = Object.keys(houseData);
    let homes = [];
    for (let i = 0; i <= userData.data.length - 1; i++){
      console.log(`i is ${i}, userdata length is ${userData.data.length}`);
      console.log(i);
      let newHome = userData.data[i];
      let newHomeName = listOfHomes[newHome];
      homes.push(houseData[newHomeName]);
      if (i == (userData.data.length - 1)) res(homes);
    }
  })
}


export async function get({params}) {
  console.log(params);
  try {
    const dbConnection = await clientPromise;
    const db = dbConnection.db("TinyTown");
    const collection = db.collection('ComfyDefault');
    const nameReturn = await collection.find({'key': params.id}).toArray();
    if (nameReturn.length){
      console.log('GOT HERE');
      let userData = nameReturn[0]
      let homes = await pickHomes(userData);
      console.log(homes);
      return {
        status: 200,
        body: { 
          User: userData,
          Homes: homes,
          id: params.id,
          hasHomes: true,
          error: null
        }
      }
    } else {
      return {
        status: 200,
        body: { error: 'User not found!', hasHomes:false, id: params.id }
      }
    }
  } catch (err){
    return{
      status: 500,
      body: {
        error: err,
        id: params.id,
        hasHomes: false,
        User: {}
      }
    }
  }

}