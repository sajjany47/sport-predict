import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema(
  {
    squadId: { type: Number, default: null },
    teamName: { type: String, default: null },
    teamShortName: { type: String, default: null },
    teamFlagUrl: { type: String, default: null },
    isWinner: { type: Boolean, default: null },
    color: { type: String, default: null },
    cricketScore: { type: Schema.Types.Mixed, default: null },
    squadNo: { type: Number, default: null },
  },
  { _id: false }
);

const VenueSchema = new Schema(
  {
    ground: { type: String, default: null },
    city: { type: String, default: null },
    country: { type: String, default: null },
    timezone: { type: String, default: null },
  },
  { _id: false }
);

const ScoreItemSchema = new Schema(
  {
    team: { type: String, default: null },
    run: { type: String, default: null },
  },
  { _id: false }
);

const ScoreSchema = new Schema(
  {
    matchName: { type: String, default: null },
    score: { type: [ScoreItemSchema], default: null },
    result: { type: String, default: null },
  },
  { _id: false }
);

const MatchSchema = new Schema(
  {
    tourId: { type: Number, default: null },
    tourName: { type: String, default: null },

    matchId: { type: Number, default: null },
    matchName: { type: String, default: null },
    matchDescription: { type: String, default: null },

    originalStartTime: { type: String, default: null }, // "1768053600000"
    startTime: { type: String, default: null }, // "10 Jan 2026, 19:30"
    endTime: { type: String, default: null },

    status: { type: String, default: null }, // LIVE, UPCOMING, etc.

    venue: { type: VenueSchema, default: null },

    tour: { type: String, default: null }, // Women / League
    format: { type: String, default: null }, // T20
    sport: { type: String, default: "cricket" },

    teams: { type: [TeamSchema], default: null },

    score: { type: ScoreSchema, default: null },

    crexUrl: { type: String, default: null },
  },
  { timestamps: true }
);

const MatchList =
  mongoose.models.MatchList || mongoose.model("MatchList", MatchSchema);
export default MatchList;
