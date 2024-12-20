export default function StartQuote({ quote, author, links }) {
  return (
    <div className="max-w-5xl grow flex flex-col justify-center overflow-hidden">
      <h1 className="font-bold sm:text-7xl text-5xl">
        <span className="text-orange-500">{'"'}</span>
        {quote}
        <span className="text-orange-500">{'"'}</span>
      </h1>
      <ul>
        <li className="sm:text-5xl text-3xl mt-8">
          <span className="text-orange-500">{">"}</span>
          {author}
        </li>
        <li>
          <a
            href="#1"
            className="hover:underline transition-all decoration-orange-500  m-4"
          >
            {links[0]}
          </a>
          <a
            href="#2"
            className="hover:underline transition-all decoration-orange-500  m-4"
          >
            {links[1]}
          </a>
        </li>
      </ul>
      <div className="h-1/3 w-4"></div>
    </div>
  );
}
