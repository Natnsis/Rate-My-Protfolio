const DevCounts = () => {
  const numericData = [
    {
      title: "developers",
      value: "12,400+",
    },
    {
      title: "versions posted",
      value: "38,000+",
    },
    {
      title: "ratings given",
      value: "210,000+",
    },
    {
      title: "avg developer rating",
      value: "4.8/5",
    },
  ];
  return (
    <div className="px-20 mt-10">
      <div className="flex justify-between">
        {numericData.map((n, index) => (
          <div className="flex flex-col items-center" key={index}>
            <h1 className="text-4xl">{n.value}</h1>
            <p className="text-muted-foreground">{n.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevCounts;
