import { useEffect, useState } from "react";
import type PlayerStats from "../../types/playerStats";
import type RankedPlayerStats from "../../types/playerStats";
import RankedPlayerStatsRow from "./rankedPlayerStatsRow";
import { useNavigate } from "react-router-dom";

function Leaderboard() {
  const navigate = useNavigate();
  const today = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );
  const tomorrow = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1,
  );
  const [stats, setPlayerStats] = useState<RankedPlayerStats[]>([]);
  const [startDate, setStartDate] = useState<string>(today.toISOString());
  const [endDate, setEndDate] = useState<string>(tomorrow.toISOString());
  const [formStartDay, setFormStartDay] = useState<number>(
    new Date().getDate(),
  );
  const [formStartMonth, setFormStartMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [formStartYear, setFormStartYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [formEndDay, setFormEndDay] = useState<number>(new Date().getDate());
  const [formEndMonth, setFormEndMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [formEndYear, setFormEndYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [isDateRange, setIsDateRange] = useState<boolean>(false);

  useEffect(() => {
    handleFetch(startDate, endDate);
  }, []);

  const handleFetch = (startDate: string, endDate: string) => {
    let params: string[] = [];
    if (startDate && endDate) {
      params.push(`startDate=${startDate}&endDate=${endDate}`);
    }
    let query;
    if (params) {
      query = `?${params.join("&")}`;
    }
    fetch(`${import.meta.env.VITE_API_URL}/leaderboards${query}`)
      .then(async (res) => {
        const data: PlayerStats[] = await res.json();
        try {
          const sortedData = data.sort((
            a: PlayerStats,
            b: PlayerStats,
          ) => (b.wins - a.wins));
          setPlayerStats(
            sortedData.map((player: PlayerStats, index: number) => ({
              ...player,
              rank: index + 1,
            })),
          );
        } catch (e) {
          console.log(e);
        }
      });
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newStartDate = new Date(
      formStartYear,
      formStartMonth - 1,
      formStartDay,
    ).toISOString();
    let newEndDate;
    setStartDate(newStartDate);
    if (isDateRange) {
      newEndDate = new Date(formEndYear, formEndMonth, formEndDay)
        .toISOString();
    } else {
      newEndDate = new Date(formStartYear, formStartMonth - 1, formStartDay + 1)
        .toISOString();
    }
    setEndDate(newEndDate);
    handleFetch(newStartDate, newEndDate);
  };

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormStartDay(parseInt(e.target.value))}
            />
          </label>
          <br />
          <label>
            Month:
            <input
              type="number"
              min={1}
              max={12}
              value={formStartMonth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormStartMonth(parseInt(e.target.value))}
            />
          </label>
          <br />
          <label>
            Year:
            <input
              type="number"
              value={formStartYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormStartYear(parseInt(e.target.value))}
            />
          </label>
        </fieldset>
        {isDateRange && (
          <fieldset>
            {isDateRange && <legend>End Date</legend>}
            <label>
              Day of month:
              <input
                type="number"
                min={1}
                max={31}
                value={formEndDay}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEndDay(parseInt(e.target.value))}
              />
            </label>
            <br />
            <label>
              Month:
              <input
                type="number"
                min={1}
                max={12}
                value={formEndMonth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEndMonth(parseInt(e.target.value))}
              />
            </label>
            <br />
            <label>
              Year:
              <input
                type="number"
                value={formEndYear}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormEndYear(parseInt(e.target.value))}
              />
            </label>
          </fieldset>
        )}
        <fieldset>
          <label>
            Date range?
            <input
              type="checkbox"
              checked={isDateRange}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIsDateRange(e.target.checked)}
            />
          </label>
          <br />
          <input type="submit" />
        </fieldset>
      </form>
      <p>
        Current selection: {new Date(startDate).toDateString()} -{" "}
        {new Date(endDate).toDateString()}
      </p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((player) => RankedPlayerStatsRow(player))}
        </tbody>
      </table>
    </>
  );
}

export default Leaderboard;
