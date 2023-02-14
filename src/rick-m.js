import React, { useState, useEffect } from "react";
import axios from "axios";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import toUpper from "lodash/toUpper";

const RickAndMorty = () => {
  const [characterList, setCharactersList] = useState([]);
  const [characterName, setCharacterName] = useState("");
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [url, setUrl] = useState("https://rickandmortyapi.com/api/character/");

  const changePrevPage = () => {
    setUrl(prevPage);
  };

  const changeNextPage = () => {
    setUrl(nextPage);
  };

  const showList = async (value) => {
    try {
      const { data } = await axios.get(
        `${url} ${!isEmpty(value) ? `&name=${value} ` : ""}`
      );
      setCharactersList(get(data, "results", []));
      setPrevPage(get(data, "info.prev", null));
      setNextPage(get(data, "info.next", null));
    } catch (error) {
      console.log(error);
    }
  };

  const findChar = (event) => {
    const { target } = event;
    setCharacterName(target.value);
    showList(target.value);
  };

  useEffect(() => {
    showList();
  }, []);

  useEffect(() => {
    console.log("prev", prevPage);
    console.log("next", nextPage);
    showList();
  }, [url]);

  return (
    <div className="h-full px-4">
      <div className="mt-3 py-4">
        <form>
          <label className="pr-4">Buscar</label>
          <input
            name="name"
            className="border-2"
            value={characterName}
            onChange={findChar}
          ></input>
        </form>
      </div>
      <div className=" col-span-2 mt-4 grid grid-cols-3 grid-rows-3 gap-4">
        {!isEmpty(characterList) &&
          characterList.map(
            (character) =>
              character.status !== "unknown" && (
                <div className=" flex space-x-3 border-2 border-black bg-gray-200">
                  <img
                    className="max-w-[100px]"
                    src={get(character, "image")}
                    alt=""
                  ></img>

                  <div>
                    <div>
                      <div className=" font-bold">{get(character, "name")}</div>
                    </div>
                    <div className=" font-semibold ">
                      <span> Gender: </span>{" "}
                      <span className=" font-normal">
                        {get(character, "gender")}
                      </span>
                    </div>
                    <div className=" font-semibold ">
                      <span> Episodes: </span>{" "}
                      {get(character, "episode", []).map((obj, key) => {
                        return key === 5 && character.episode.length > 4
                          ? "..."
                          : key < 5 && key + 1 + `, `;
                      })}
                    </div>
                    <div
                      className={` bg-green-75 w-[60px] pl-3 ${
                        toUpper(get(character, "status")) === "ALIVE"
                          ? "bg-green-300 text-green-800"
                          : " bg-red-400 text-red-800"
                      }`}
                    >
                      {get(character, "status")}
                    </div>
                  </div>
                </div>
              )
          )}
      </div>
      <div className="mt-4 flex space-x-5">
        <button
          className={
            prevPage === null
              ? "disabled border-1 bg-gray-200 px-4 text-gray-300"
              : "border-1 bg-gray-300 px-4"
          }
          onClick={changePrevPage}
        >
          {" "}
          {"< |"}{" "}
        </button>
        <button
          className={
            nextPage === null
              ? "disabled border-1 bg-gray-200 px-4 text-gray-300"
              : "border-1 bg-gray-300 px-4"
          }
          onClick={changeNextPage}
        >
          {" "}
          {"| >"}{" "}
        </button>
      </div>
    </div>
  );
};

export default RickAndMorty;
