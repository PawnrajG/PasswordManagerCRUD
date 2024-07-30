import { useEffect ,useState } from 'react'
import axios from 'axios'
import image from './assets/noworry.png'
import './App.css'
import logo from './assets/logo.png'

function App() {
  const [details, setDetails] = useState([]);  // the details variable is initialized by setDetails function 
  const [filteredDetails, filterDetails] = useState([]);
  const [isModelUsed, setModel] = useState(false);
  const [userData, setUserData] = useState({
    concern: "",
    password: ""
  });
  
  //creating search function
  const handlingSearching = (text) =>{
    // console.log(text);
    const searchText = text.target.value.toLowerCase();
    
    //filtering the search data from json file
    const filteredData = details.filter((data)=>
      data.concern.toLowerCase().includes(searchText));
    filterDetails(filteredData);
  }

  const getCredentials = async () =>{
    await axios.get("http://localhost:8000/credentials").then((res)=>{
      // console.log(res.data);
      setDetails(res.data);
      filterDetails(res.data);
    });
  };

  // it is the function will execute first after the rendering of the website
  useEffect(()=>{
    // console.log("in useffect");
    getCredentials();
  },[]);
  
  //creating delete function
  const deleteDetails = async (id,concern) =>{
    const isConfirm = confirm(`Are you sure to delete ${concern}'s password?`);
    if(isConfirm){
      try{
        await axios.delete(`http://localhost:8000/credentials/${id}`).then((res)=>{
          setDetails(res.data);
          filterDetails(res.data);
        });
        // console.log('Response:', response.data);
      }catch(error){
        console.log(error.config);
      }
    }
  };


  //to handle the adding new data from user
  const handleAddRecord = ()=>{
    setUserData({
      concern: "",
      password: ""
    });
    setModel(true);
  }

  const handleData = (input) =>{
    setUserData({...userData,[input.target.name]: input.target.value});
    // console.log(userData.id);
    // console.log(userData.concern);
    // console.log(userData);
  }

  const addData = async (e)=>{
    e.preventDefault();
    if(userData.id){
      await axios.patch(`http://localhost:8000/credentials/${userData.id}`,userData).then((res)=>{
        // console.log("in patch");
        alert(res.data.message);
      });
    }else{
      await axios.post("http://localhost:8000/credentials",userData).then((res)=>{
        // console.log("in post");
        alert(res.data.message);
      });
    }
    setUserData({
      concern: "",
      password: ""
    });
    closeModel();
  }
  //to close popup and refresh the page
  const closeModel = () =>{
    setModel(false);
    getCredentials();
  }
  
  const updateData = (data)=>{
    // console.log(data);
    setUserData(data);
    setModel(true);
  }


  return (
    <>
      <div className='max-w-80 bg-black h-auto min-h-screen mx-auto font-bold font-sans'>
        <div className='flex flex-row border-y-4 border-cyan-400'>
          <img className="h-12 m-3" src={logo} />
          <h2 className='text-cyan-400 text-lg text-center p-5'>Password Repository</h2>
        </div>
        <section className='h-auto'>
          <p className='text-md text-white p-5 text-center'>Access to your passwords anywhere anytime No need to remember!</p>
          <img className='h-32 rounded-full ml-24 my-4' src={image}/> 
          <section className='font-medium border-8 border-black space-y-4 text-sm p-2'>
            <div className='my-5 h-28 flex flex-col mx-3'>
              <input className='text-cyan-600 text-md rounded-full outline-none px-5 py-3' type="search" placeholder='search here . . .' onChange={handlingSearching}/>
              <button onClick={handleAddRecord} className='my-3 pb-2 px-1 mx-auto w-14 text-cyan-400 text-5xl border-2 border-cyan-400 rounded-2xl'>+</button>
            </div>
            <table className='table-auto w-full text-white text-center border-2 border-cyan-400'>
              <thead className='border-2 border-cyan-400'>
                <tr className=' text-sm text-cyan-400'>
                  <th className='py-2 px-1'>Concerned</th>
                  <th className='py-2 px-1'>Password</th>
                  <th className='py-2 px-1'>Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  filteredDetails && filteredDetails.map((data)=>{
                    return (
                      <tr key={data.id} className='font-normal hover:bg-slate-500 hover:scale-105 hover:text-black transition ease-in-out duration-500'>
                        <td onClick={()=>updateData(data)}><input className="text-md rounded-md w-20 text-center outline-none px-2 py-1 text-black cursor-pointer" type="text" value={data.concern}/></td>
                        <td onClick={()=>updateData(data)}><input className="text-md rounded-md w-24 text-center outline-none px-2 py-1 text-black cursor-pointer" type="password" value={data.password}/></td>
                        <td><button onClick={()=>deleteDetails(data.id,data.concern)} className='h-6 my-2 px-1 text-slate-100 text-xl font-bold ml-1'>&times;</button></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </section>
        </section>
        {isModelUsed && (<div className='bg-opacity-70 bg-black z-2 fixed top-0 left-0 w-full h-full overflow-hidden'>
            <div className='flex flex-col items-center justify-center my-52 mx-auto w-80 text-white bg-black rounded-3xl border-4 border-white'>
              <h2 className='text-2xl m-5 text-cyan-400'>{userData.id? "Alter Record" : "Add Record"} <span className=' text-3xl ml-24 cursor-pointer' onClick={closeModel}>&times;</span></h2>
              <form className='flex flex-col m-1 w-72 text-black' method="post">
                  <label className='pl-3  text-white'>Concern</label><input value={userData.concern} type="text" name="concern" className='m-3 outline-none text-md py-2 px-5 rounded-2xl font-normal' onChange={handleData}/>
                  <label className='pl-3  text-white'>Password</label><input value={userData.password} type="text" name="password" className='m-3 outline-none text-md py-2 px-5 rounded-2xl font-normal' onChange={handleData}/>
                  <button onClick={addData} type="submit" className='bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full w-20 mx-auto my-5'>Add</button>
              </form>
            </div>
        </div>)}
      </div>
      
    </>
  )
}

export default App
