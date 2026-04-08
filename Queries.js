// Switch to database
db = db.getSiblingDB("zipdb");

print("Query 1: States that have a city called BOSTON");

printjson(
  db.zips
    .aggregate([{ $match: { city: "BOSTON" } }, { $group: { _id: "$state" } }])
    .toArray(),
);

print("Query 2: States and cities containing BOST");

printjson(
  db.zips
    .aggregate([
      { $match: { city: { $regex: "BOST", $options: "i" } } },
      { $project: { _id: 0, city: 1, state: 1 } },
    ])
    .toArray(),
);

print("Query 3: City in each state with most zip codes");

printjson(
  db.zips
    .aggregate([
      {
        $group: {
          _id: { state: "$state", city: "$city" },
          zipCount: { $sum: 1 },
          population: { $sum: "$pop" },
        },
      },
      { $sort: { zipCount: -1 } },
      {
        $group: {
          _id: "$_id.state",
          city: { $first: "$_id.city" },
          zipCount: { $first: "$zipCount" },
          population: { $first: "$population" },
        },
      },
      { $sort: { population: -1 } },
    ])
    .toArray(),
);
