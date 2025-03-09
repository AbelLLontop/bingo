import { memo, useMemo, useState } from "react"
import { cn } from "./utils/cn"



type size = "extrasmall" | "small"

interface BingoCellsProps {
  value: number
  select?: boolean,
  size?: size,
  win?: boolean
}
const BingoCell = memo(({ select = false, value, size, win }: BingoCellsProps) => {
  return (<div className={cn("relative flex items-center justify-center w-12 h-12 text-xl font-semibold border text-cyan-300 bg-cyan-800", {
    "w-6 h-6 text-xs": size == "small",
    "w-4 h-4 text-[8px]": size == "extrasmall",
    "text-yellow-300 bg-yellow-800": win
  })}>

    {select && (
      <span className={cn("absolute w-full h-full border-2 rounded-full border-cyan-300 bg-cyan-500 opacity-85", {
        "border-yellow-300 bg-yellow-500": win
      })}></span>
    )}

    {value}
    {win && (<div className="absolute w-1 h-full bg-yellow-100 blur-[1px] !shadow-[0px_0px_10px_yellow] left-1/2 "></div>)}
  </div>)

})

interface BingoCardProps {
  bingo: number[][],
  size?: size,
  market: Set<number>,
}
const BingoCard = memo(({ bingo, size, market }: BingoCardProps) => {
  const winRows = useMemo(() => validateWinRow(bingo, market), [bingo, market]);
  return (
    <article className={cn("flex overflow-hidden border-4 border-cyan-300 rounded-xl", {
      "border-yellow-300": (winRows.size > 0)
    })}>
      {bingo.map((col: number[], index: number) => (
        <div key={index}>
          {col.map(value => (
            <BingoCell size={size} key={value} value={value} select={market.has(value)} win={winRows.has(value)} />
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
  const secondaryBingos = bingos.slice(6, 20)
  const othersBingos = bingos.slice(20, bingos.length)
  return (
    <div className="flex flex-wrap items-start w-full gap-2 justify-evenly md:justify-start">
      {principalBingos.map((bingo, index: number) => (
        <BingoCard key={index} bingo={bingo} market={market} />

      ))}

      {secondaryBingos.map((bingo, index: number) => (
        <BingoCard key={index} bingo={bingo} size="small" market={market} />
      ))}

      {othersBingos.map((bingo, index: number) => (
        <BingoCard key={index} bingo={bingo} size="extrasmall" market={market} />
      ))}
    </div>

  )
}

const validateWinRow = (bingo: number[][], market: Set<number>) => {
  const valuesWin = new Set<number>();
  for (let col = 0; col < bingo.length; col++) {
    const matchAllRow = bingo[col].every(num => market.has(num));
    if (matchAllRow) {
      const rowValues = bingo[col];
      rowValues.forEach(v => valuesWin.add(v))
    }
  }
  return valuesWin;
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
    <main className="w-full min-h-screen bg-slate-800">
      <header className="py-8 text-center">
        <h1 className="text-3xl font-bold text-cyan-100">BINGO GAME</h1>
        <p className="text-cyan-600">¡Buena suerte!</p>
      </header>
      <div className="container mx-auto ">

        <div className="flex justify-between py-4">
          <div className="text-xl text-cyan-300">Todos los números ({marketNumbers.size}/75)</div>
          <button className="px-4 py-2 outline-none hover:bg-cyan-600 active:bg-cyan-700 bg-cyan-800 text-cyan-300 rounded-xl" onClick={generateNumber}>Generate Number</button>
        </div>
        <ListMakertValues marketNumbers={marketNumbers} />
        <AllMarksNumbers marketNumbers={marketNumbers} />

        <div className="flex justify-between py-4">
          <div className="text-xl text-cyan-300">Cartones de Bingo ({bingos.length})</div>
          <button className="px-4 py-2 outline-none cursor-pointer hover:bg-cyan-600 active:bg-cyan-700 bg-cyan-800 text-cyan-300 rounded-xl" onClick={generateCard}>Generar Cartones</button>
        </div>
        <BoardBingoList bingos={bingos} market={marketNumbers} />
      </div>

    </main>
  )
}

const Ball = memo(({ value }: { value: number }) => {
  return (
    <div className={cn("flex items-center justify-center w-12 h-12 rounded-full text-md bg-cyan-700", {
      "bg-red-700": value >= 1 && value <= 15,
      "bg-blue-700": value >= 16 && value <= 30,
      "bg-purple-700": value >= 31 && value <= 45,
      "bg-green-700": value >= 46 && value <= 60,
      "bg-orange-700": value >= 61 && value <= 75,
    })}>
      <div className="flex items-center justify-center text-white rounded-full w-7 h-7 bg-white/20">
        {value}
      </div>
    </div>
  )
})

const ListMakertValues = ({ marketNumbers }: { marketNumbers: Set<number> }) => {
  const listValues = Array.from(marketNumbers.values())
  return (
    <div className="flex flex-wrap gap-2">
      {listValues.map((value, index: number) => (
        <Ball key={index} value={value} />
      ))}
    </div>
  )
}
const AllMarksNumbers = ({ marketNumbers }: { marketNumbers: Set<number> }) => {
  const listValues = Array.from(marketNumbers.values())
  const B = listValues.filter(value => value >= 1 && value <= 15);
  const I = listValues.filter(value => value >= 16 && value <= 30);
  const N = listValues.filter(value => value >= 31 && value <= 45);
  const G = listValues.filter(value => value >= 46 && value <= 60);
  const O = listValues.filter(value => value >= 61 && value <= 75);

  return (
    <div className="grid grid-cols-5 gap-2 p-2 rounded-lg bg-cyan-950">
      <RowMarkListBalls title="B" values={B} />
      <RowMarkListBalls title="I" values={I} />
      <RowMarkListBalls title="N" values={N} />
      <RowMarkListBalls title="G" values={G} />
      <RowMarkListBalls title="O" values={O} />

    </div>
  )
}

const RowMarkListBalls = ({ title, values }: { title: string, values: number[] }) => {
  return (
    <div>
      <div className="w-full p-2 mb-2 font-bold text-center text-white rounded-lg bg-cyan-800">{title}</div>
      <div className="flex flex-col items-center gap-2">
        {values.map((value, index) => (
          <Ball key={index} value={value} />
        ))}
      </div>
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
