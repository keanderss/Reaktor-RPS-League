import { useEffect, useState } from "react"
import type MatchData from "../../types/match"
import MatchCard from "./matchCard"
import { useNavigate } from "react-router-dom"

function MatchHistory() {
  const navigate = useNavigate()
  const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
  const tomorrow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)
  const [takeCount, setTakeCount] = useState<number>(20)
  const [player, setPlayer] = useState<string>("")
  const [matches, setMatches] = useState<MatchData[]>([])
  const [startDate, setStartDate] = useState<string>(today.toISOString())
  const [endDate, setEndDate] = useState<string>(tomorrow.toISOString())
  const [formStartDay, setFormStartDay] = useState<number>(new Date().getDate())
  const [formStartMonth, setFormStartMonth] = useState<number>(new Date().getMonth() + 1)
  const [formStartYear, setFormStartYear] = useState<number>(new Date().getFullYear())
  const [formEndDay, setFormEndDay] = useState<number>(new Date().getDate() + 1)
  const [formEndMonth, setFormEndMonth] = useState<number>(new Date().getMonth() + 1)
  const [formEndYear, setFormEndYear] = useState<number>(new Date().getFullYear())
  const [isDateRange, setIsDateRange] = useState<boolean>(false)

  useEffect(() => {
    console.log(startDate)
    console.log(endDate)
    handleFetch(startDate, endDate, takeCount, player)
  }, [])

  const handleFetch = (startDate?: string, endDate?: string, count: number = 100, player?: string) => {
    let params: string[] = [];
    if (startDate && endDate) {
      params.push(`startDate=${startDate}&endDate=${endDate}`)
      console.log(new Date(startDate).toLocaleDateString())
      console.log(new Date(endDate).toLocaleDateString())
    }
    if (count) {
      params.push(`count=${count}`)
    }
    if (player) {
      params.push(`player=${player}`)
    }
    let query;
    if (params) {
      query = `?${params.join("&")}`
    }
    console.log(query)
    fetch(`${import.meta.env.VITE_API_URL}/matches${query}`)
      .then(async res => {
        const data: MatchData[] = await res.json();
        const sortedData = data.sort((a: MatchData, b: MatchData) => Date.parse(b.datetime) - Date.parse(a.datetime));
        setMatches(sortedData);
      })
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newStartDate = new Date(formStartYear, formStartMonth - 1, formStartDay).toISOString()
    console.log(newStartDate)
    let newEndDate;
    setStartDate(newStartDate)
    if (isDateRange) {
      newEndDate = new Date(formEndYear, formEndMonth - 1, formEndDay).toISOString()
    } else {
      newEndDate = new Date(formStartYear, formStartMonth - 1, formStartDay + 1).toISOString()
    }
    console.log(newEndDate)
    setEndDate(newEndDate)
    console.log(startDate)
    console.log(endDate)
    handleFetch(newStartDate, newEndDate, takeCount, player)
  }

  return (
    <>
      <button onClick={() => navigate("/")}>Home</button>
      <form onSubmit={handleSubmit}>
        <fieldset>
          {isDateRange && <legend>Start Date</legend>}
          <label>
            Day of month:
            <input
              type="number"
              min={1}
              max={31}
              value={formStartDay}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormStartDay(parseInt(e.target.value))}
            />
          </label>
          <br/>
          <label>
            Month:
            <input
              type="number"
              min={1}
              max={12}
              value={formStartMonth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormStartMonth(parseInt(e.target.value))}
            />
          </label>
          <br/>
          <label>
            Year:
            <input
              type="number"
              value={formStartYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormStartYear(parseInt(e.target.value))}
            />
          </label>
        </fieldset>
        {isDateRange && <fieldset>
          {isDateRange && <legend>End Date</legend>}
          <label>
            Day of month:
            <input
              type="number"
              min={1}
              max={31}
              value={formEndDay}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormEndDay(parseInt(e.target.value))}
            />
          </label>
          <br/>
          <label>
            Month:
            <input
              type="number"
              min={1}
              max={12}
              value={formEndMonth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormEndMonth(parseInt(e.target.value))}
            />
          </label>
          <br/>
          <label>
            Year:
            <input
              type="number"
              value={formEndYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormEndYear(parseInt(e.target.value))}
            />
          </label>
        </fieldset>}
        <fieldset>
          <label>
            Date range?
            <input
              type="checkbox"
              checked={isDateRange}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsDateRange(e.target.checked)}
            />
          </label>
          <br/>
          <label>
            How many?
            <input 
              type="number"
              value={takeCount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTakeCount(parseInt(e.target.value))}
            />
          </label>
          <br/>
          <label>
            Player:
            <input 
              type="string"
              value={player}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayer(e.target.value)}
            />
          </label>
          <br/>
          <input type="submit"/>
        </fieldset>
      </form>
      <p>Current selection: {new Date(startDate).toDateString()}  - {new Date(endDate).toDateString()}</p>
      <div>
        <p>Matches: </p>
        {matches.map(match => MatchCard(match))}
      </div>
    </>
  )
}

export default MatchHistory