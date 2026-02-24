import { Router } from "express";
import { isAuthorized } from "../utils/isAuthorized";
import { getCountriesStartingWith } from "../test/getCountrieBySearch";

const countriesRouter = Router();

countriesRouter.get("/", isAuthorized, async (req, res) => {
	let srch = req.query.srch as string;
	let countries = await getCountriesStartingWith(srch);

  return res.json({ items: countries });
});


export default countriesRouter;
