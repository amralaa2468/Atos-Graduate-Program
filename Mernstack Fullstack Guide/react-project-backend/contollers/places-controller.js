import fs from "fs";

import { validationResult } from "express-validator";
import mongoose from "mongoose";

import HttpError from "../models/http-error.js";
import getCoordsForAddress from "../util/location.js";
import Place from "../models/place.js";
import User from "../models/user.js";

//---------------------------------------------------------------------------------------
async function getPlaceById(req, res, next) {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Couldn't find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could't find a place for the provided place ID.",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
}
//---------------------------------------------------------------------------------------
async function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid;

  //let places;
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }
  // if(!places || places.length ===0){}
  if (!userWithPlaces || userWithPlaces.length === 0) {
    const error = new HttpError(
      "Could't find places for the provided user ID.",
      404
    );
    return next(error);
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
}
//---------------------------------------------------------------------------------------
async function createPlace(req, res, next) {
  const errors = validationResult(req);
  const errorBody = errors.errors[0];

  if (!errors.isEmpty()) {
    next(
      new HttpError(
        errorBody.msg + " in the " + errorBody.path + " field.",
        422
      )
    );
  }

  const { title, description, address } = req.body;
  //const title = req.body.title;
  const coordinates = getCoordsForAddress(address);

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating place failed please try again.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Couldn't find user for provided id.", 500);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();

    session.startTransaction();

    await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, Please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
}
//---------------------------------------------------------------------------------------
async function updatePlaceById(req, res, next) {
  const errors = validationResult(req);
  const errorBody = errors.errors[0];

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        errorBody.msg + " in the " + errorBody.path + " field.",
        422
      )
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Couldn't update place.",
      500
    );
    return next(error);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this place.", 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could't update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
}
//---------------------------------------------------------------------------------------
async function deletePlaceById(req, res, next) {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could't find a place with the provided id.",
      404
    );
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place.",
      401
    );
    return next(error);
  }

  const imagePath = place.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne({ session: session });
    place.creator.places.pull(place);
    await place.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted place successfully!" });
}

export default {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlaceById,
  deletePlaceById,
};
