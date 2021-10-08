import {useState, useEffect} from "react"
import axios from "axios"
import './App.css';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// api docs: https://randomuser.me/documentation

// TO DO:
// Implement sorting by date *
// Refactor filtering *

// BONUS TO DO:
// Refactor to make UI more reusable elsewhere in app

// AND IF THERE'S STILL TIME...
// How can you improve the UI? How can you get that sorting arrow looking right?

function App() {
  const [filter, setFilter] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")
  const [data, setData] = useState()
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    axios.get(`https://randomuser.me/api/?results=50`)
      .then(response => response.data)
      .then(d => {
        const {results} = d
        setData(results)
      })
      .catch(error => console.log(error))
  }, [])

  const filterData = (data) => {
    
    // Refactored, it might be a little more readable this way, but the original method was sleaker 
    //and in my opinion a better implmentation
      if (data && filter !== "") { //Prevents change when data is null
        let filteredData = data
        filteredData = filteredData.filter((user) => {
          let {first, last} = user.name;
          return first.toLowerCase().includes(filter.toLowerCase()) || last.toLowerCase().includes(filter.toLowerCase())
        })
        return filteredData
      }

      return data // Handles data change without filter
  }

  useEffect(() => {
    const filtered = filterData(data)
    setFilteredData(filtered)
  }, [data, filter])

  useEffect(() => {
    
    if (data) {
      console.log(sortDirection)
      let tmp = data.sort((first, second) => {
        let tmp1 = new Date(first.registered.date)
        let tmp2 = new Date(second.registered.date)
        if (sortDirection === "asc"){
          return tmp1 - tmp2
        }
        return tmp2 - tmp1
      })
      setData(tmp)
    }
      
  }, [sortDirection])

  const renderSortingIcon = () => {
    if (sortDirection === "asc") return <ArrowDownwardIcon fontSize={"small"}/>
    if (sortDirection === "desc") return <ArrowUpwardIcon fontSize={"small"}/>
    return sortDirection === "asc" ? <ArrowDownwardIcon fontSize={"small"}/> : <ArrowUpwardIcon fontSize={"small"}/>
  }

  const renderRows = () => {
    const rows = []
    for (let i = 0; i < filteredData?.length; i++){
      rows.push(
        <tr>
          <td>{filteredData[i].name.first} {filteredData[i].name.last}</td>
          <td>{filteredData[i].login.username}</td>
          <td>{filteredData[i].registered.date}</td>
        </tr>
      )
    }
    return rows
  }

  return (
    <div className="App">
      <h1>User info</h1>
      <div>
        <label>Search by name:</label>
        <input type="text" id="search" name="search" onChange={e => setFilter(e.target.value)}/>
      </div>
      <span>
        {!filteredData && (
          !filter ? ("Error") : ("No results")
        )}
      </span>
      <table>
        <thead>
          <tr>
            <th>
              Name
            </th>
            <th>
              Username
            </th>
            <th>
              Registration Date
              <span
                onClick={() => {
                  const newDirection = sortDirection === "asc" ? "desc" : "asc"
                  setSortDirection(newDirection)
                }}
              >
              {renderSortingIcon()}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </table>
    </div>
  );
}

export default App;
