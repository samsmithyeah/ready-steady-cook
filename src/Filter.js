import { Button, IconButton, TextField } from '@material-ui/core';
import FilterChips from './FilterChips.js'
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import { useState } from 'react'


export default function Filter(props) {

  const [newFilter, setNewFilter] = useState("");

  const { history, filters, inputRef, handleRestartClick, setFilters, setFilteredResults, searchTerm, results } = props;

  function handleAddFilter(event) {
    event.preventDefault();
  
    !filters.includes(newFilter) && setFilters([...filters, newFilter])

    setNewFilter("")
  }

  function handleDeleteFilter(toDelete) {
    setFilters(filters.filter(filter => filter !== toDelete))
  }

  function handleFilterResults() {
    setFilteredResults(results.filter(result => {
      return filters.every(filter => {
        return result.recipe.ingredientLines.toString().toLowerCase().includes(filter.toLowerCase())
      })
    }))
    history.push("/results")
  }

  return (
    <>
      <h1>What would you like with your {searchTerm}?</h1>
      <form noValidate autoComplete="off" onSubmit={handleAddFilter}>
        <TextField inputRef={inputRef} id="standard-basic" value={newFilter} onChange={e => setNewFilter(e.target.value)} />
        <IconButton disabled={newFilter.length === 0} variant="contained" color="primary" type="submit"><AddIcon /></IconButton>
      </form>
      <FilterChips filters={filters} onDelete={handleDeleteFilter}/>
      <br />
      <Button variant="contained" color="primary" onClick={handleFilterResults} endIcon={<SendIcon />} disableElevation>View results</Button>
      <br />
      <Button onClick={handleRestartClick}>Start again</Button>
    </>
  )
}

