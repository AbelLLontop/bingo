import { memo, useState } from "react"

interface BingoCellsProps {
  value: number
  select?: boolean,
  size?: "extrasmall" | "small"

}
const BingoCell = memo(({ select = false, value, size }: BingoCellsProps) => {
  //temporal solution
  if (size == "small") {
    return (<div className="w-6 h-6 border flex justify-center items-center text-xs font-semibold  text-cyan-300 bg-cyan-800 relative">
      {select && (
        <span className="w-full h-full border-cyan-300 border-1 bg-cyan-500 rounded-full absolute"></span>
      )}
      {value}
    </div>)
  }
  if (size == "extrasmall") {
    return (<div className="w-4 h-4 border flex justify-center items-center text-[8px] font-semibold  text-cyan-300 bg-cyan-800 relative">
      {select && (
        <span className="w-full h-full border-cyan-300 border-1 bg-cyan-500 rounded-full absolute"></span>
      )}
      {value}
    </div>)
  }


  return (<div className="w-12 h-12 border flex justify-center items-center text-xl font-semibold  text-cyan-300 bg-cyan-800 relative">
    {select && (
      <span className="w-full h-full border-cyan-300 border-2 bg-cyan-500 rounded-full absolute"></span>
    )}
    {value}
  </div>)
})

interface BingoCardProps {
  bingo: number[][],
  size?: "extrasmall" | "small",
  market: Set<number>
}
const BingoCard = memo(({ bingo, size, market }: BingoCardProps) => {
  return (
    <article className="flex border-cyan-300 border-4 rounded-xl overflow-hidden">
      {bingo.map((col: number[], index: number) => (
        <div key={index}>
          {col.map(value => (
            <BingoCell size={size} key={value} value={value} select={market.has(value)} />
          ))}

        </div>
      ))}
      <div>
      </div>
    </article>
  )
})


const BoardBingoList = ({ bingos, market }: { bingos: number[][][], market: Set<number> }) => {
  const principalBingos = bingos.slice(0, 6);
  const secondaryBingos = bingos.slice(5, 15)
  const othersBingos = bingos.slice(14, bingos.length - 1)
  return (
    <div className="flex flex-col gap-2">

      <div className="flex flex-wrap gap-2 justify-center">
        {principalBingos.map((bingo, index: number) => (
          <div key={index} className="grow-0 shrink-0">
            <BingoCard bingo={bingo} market={market} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center  gap-2">
        {secondaryBingos.map((bingo, index: number) => (
          <div key={index} className="grow-0 shrink-0 ">
            <BingoCard bingo={bingo} size="small" market={market} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center  text-base gap-2">
        {othersBingos.map((bingo, index: number) => (
          <div key={index} className="grow-0 shrink-0 bg-blue-500">
            <BingoCard bingo={bingo} size="extrasmall" market={market} />
          </div>
        ))}
      </div>
    </div>
  )
}


function App() {
  const [bingos, setBingos] = useState<number[][][]>([])
  const [marketNumbers, setMarketNumbers] = useState<Set<number>>(new Set());

  const generateCard = () => {
    const valueBingo = generateRandomValuesBingoCard();
    setBingos(b => [...b, valueBingo]);
  }

  const generateNumber = () => {
    const valueRandom = generateRandomNumberBingoCard(marketNumbers);
    setMarketNumbers(prev => new Set([...prev, valueRandom]));
  }


  return (
    <main className="w-full min-h-screen bg-slate-800 flex justify-center items-center flex-col gap-4">
      <ListMakertValues marketNumbers={marketNumbers} />
      <button className="hover:bg-cyan-600 active:bg-cyan-700 bg-cyan-800 text-cyan-300  px-4 py-2 rounded-xl outline-none" onClick={generateNumber}>Generate Number</button>
      <button className="hover:bg-cyan-600 active:bg-cyan-700 bg-cyan-800 text-cyan-300  px-4 py-2 rounded-xl outline-none" onClick={generateCard}>{bingos.length} - Generar Boleto</button>

      <BoardBingoList bingos={bingos} market={marketNumbers} />

    </main>
  )
}

const ListMakertValues = ({ marketNumbers }: { marketNumbers: Set<number> }) => {
  const listValues = Array.from(marketNumbers.values())
  return (
    <div className="flex gap-2 flex-wrap">
      {listValues.map((value, index: number) => (
        <div key={index} className="w-16 h-16 border-4 flex justify-center items-center text-2xl font-semibold  text-cyan-300 bg-cyan-800 relative rounded-full">
          {value}
        </div>
      ))}
    </div>
  )
}


const generateRandomArrayNumbersByRange = ([min, max]: [number, number], count: number): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    const randomNum = generateRandomNumberByRange([min, max]);
    numbers.add(randomNum);
  }
  return Array.from(numbers);
}

const generateRandomNumberByRange = ([min, max]: [number, number]) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomNumberBingoCard = (marketNumbers: Set<number>) => {
  const MAX_NUMBER = 75;
  const MIN_NUMBER = 1;
  if (marketNumbers.size == MAX_NUMBER) return MAX_NUMBER;
  let valueRandom = generateRandomNumberByRange([MIN_NUMBER, MAX_NUMBER]);
  while (marketNumbers.has(valueRandom)) {
    valueRandom = generateRandomNumberByRange([MIN_NUMBER, MAX_NUMBER]);
  }
  return valueRandom;

}


const generateRandomValuesBingoCard = (): number[][] => {
  const countCells = 5;
  const B = generateRandomArrayNumbersByRange([1, 15], countCells)
  const I = generateRandomArrayNumbersByRange([16, 30], countCells)
  const N = generateRandomArrayNumbersByRange([31, 45], countCells)
  const G = generateRandomArrayNumbersByRange([46, 60], countCells)
  const O = generateRandomArrayNumbersByRange([61, 75], countCells)
  return [B, I, N, G, O]
}
export default App
