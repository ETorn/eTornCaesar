module.exports = {
  mongodb: {
    address: 'localhost'
  },
   mqtt: {
    address: 'mqtt://localhost'
  },
  node: {
    port: 8081,
    address: 'http://localhost:8080'  //El port ha de coincidir amb la linia anterior
  },
  dataFile: 'config/basedata.json'
};
