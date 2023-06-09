import { useEffect, useState } from "react";
import { Box, Button, Grid, LinearProgress } from "@mui/material";
import CharacterCard from "./CharacterCard";
import { useCharsContext } from "../../../context/CharsContext";
import { useSort } from "../../../hooks/useSort";

export default function DisplayResults() {
  const {
    allCharacters,
    retrieveCharacters,
    searchInput,

    filteredResults,
    setFilteredResults,
    raceFilters,

    sortingMethod,
  } = useCharsContext();
  const [visibleChars, setVisibleChars] = useState(24);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    retrieveCharacters()
      .then(() => {
        const filteredData = allCharacters.filter((char) =>
          raceFilters.length > 0
            ? raceFilters.includes(char.appearance.race)
            : allCharacters
        );

        console.log(filteredData, "filter");

        // Filter the data based on user's input
        if (searchInput !== "") {
          const queriedData = filteredData.filter((char) => {
            return char.name.toLowerCase().includes(searchInput.toLowerCase());
          });
          setFilteredResults(queriedData);
        } else {
          setFilteredResults(filteredData);
        }

        // Filter the data based on user's input
        // if (searchInput !== "") {
        //   const queriedData = allCharacters.filter((char) => {
        //     return char.name.toLowerCase().includes(searchInput.toLowerCase());
        //   });

        // const filteredData = queriedData.filter((obj) =>
        //   raceFilters.length > 0
        //     ? raceFilters.every(
        //         (filterTag) => obj.appearance.race === filterTag
        //       )
        //     : queriedData
        // );

        // console.log(filteredData, "filtered");

        //   setFilteredResults(queriedData);
        // } else {
        //   setFilteredResults(allCharacters);
        // }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [searchInput, raceFilters]);

  const dataCopy = [...filteredResults];
  const sortCharacterCards = useSort(
    sortingMethod.sort,
    sortingMethod.reverseOrder,
    dataCopy
  );

  // Render individual character
  const renderCharItem = () => {
    return sortCharacterCards.slice(0, visibleChars).map((char) => {
      return (
        <Grid item xs={6} sm={3} md={2.4} lg={1.5} key={char.id}>
          <CharacterCard char={char} />
        </Grid>
      );
    });
  };

  // Load more characters
  const showMoreChars = () => {
    setVisibleChars(visibleChars + 24);
  };

  return (
    <Box textAlign="center">
      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          <Grid container spacing={2}>
            {renderCharItem()}
          </Grid>
          {filteredResults.length > visibleChars ? (
            <Button
              variant="contained"
              onClick={showMoreChars}
              sx={{
                height: "50px",
                maxWidth: "50vw",
                width: "100vw",
                minWidth: "375px",
                marginTop: "2rem",
                marginBottom: "2rem",
                borderRadius: "1px",
                fontWeight: "bold",
                backgroundColor: "#skyblue",
                color: "#000",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
                transition: "background-color 0.2s ease-out",
                "&:hover": {
                  backgroundColor: "#f44336",
                  color: "#fff",
                },
              }}
            >
              Load More
            </Button>
          ) : null}
        </>
      )}
    </Box>
  );
}
