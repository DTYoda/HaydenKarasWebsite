export default function StartQuote({ quote, author }) {
  return (
    <div className="max-w-5xl grow flex flex-col justify-center overflow-hidden">
      <h1 className="font-bold sm:text-7xl text-5xl">{'"' + quote + '"'}</h1>
      <ul>
        <li className="sm:text-5xl text-3xl mt-8">
          {"> "} {author}
        </li>
        <li>
          <a
            href="#1"
            className="hover:underline transition-all hover:font-bold m-4"
          >
            abilties
          </a>
          <a
            href="#2"
            className="hover:underline transition-all hover:font-bold m-4"
          >
            education
          </a>
        </li>
      </ul>
      <div className="h-1/3 w-4"></div>
    </div>
  );
}
