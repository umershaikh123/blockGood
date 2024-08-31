import React from "react"
import { Button } from "@mui/material"
import { Close } from "@mui/icons-material"
import TextField from "@mui/material/TextField"
import PhotoIcon from "@mui/icons-material/Photo"
import InputAdornment from "@mui/material/InputAdornment"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"

const DonationPopup = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <div onClick={event => event.stopPropagation()}>
      <div className="flex flex-col w-[26rem] h-[20rem] bg-[var(--Bg)] rounded-xl justify-evenly items-center relative">
        <div className=" absolute top-2 right-5" onClick={handleClose}>
          <Close
            sx={{
              color: "var(--primary)",
              fontSize: 40,
              ":hover": {
                transition: "transform 0.3s ease-in-out",

                transform: "rotate(90deg)",
              },
            }}
          />
        </div>
        <h1 className=" text-4xl text-[var(--primary)] font-semibold">
          Donate
        </h1>
        <TextField
          type="number"
          label="Amount"
          placeholder="Enter Donation amount..."
          InputProps={{
            inputProps: { step: "0.01" },
          }}
          sx={{
            maxWidth: "20rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--primary)",
            color: "var(--Bg)",
            textTransform: "capitalize",
            px: "3rem",
            py: "4px",
            fontWeight: 500,
            borderRadius: "0.3rem",
          }}
        >
          Donate
        </Button>
      </div>
    </div>
  )
}

export function RowRadioButtonsGroup() {
  return (
    <div className=" min-w-[25rem]">
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          sx={{
            color: "var(--secondary)",
            "&.Mui-checked": {
              color: "var(--secondary)",
            },
          }}
        >
          <FormControlLabel
            value="organization"
            control={
              <Radio
                sx={{
                  color: "var(--secondary)",
                  "&.Mui-checked": {
                    color: "var(--secondary)",
                  },
                }}
              />
            }
            label="Organization"
            sx={{ color: "var(--secondary)" }}
          />
          <FormControlLabel
            value="individual"
            control={
              <Radio
                sx={{
                  color: "var(--secondary)",
                  "&.Mui-checked": {
                    color: "var(--secondary)",
                  },
                }}
              />
            }
            label="Individual"
            sx={{ color: "var(--secondary)" }}
          />
        </RadioGroup>
      </FormControl>
    </div>
  )
}

export const CampaignPopup = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <div onClick={event => event.stopPropagation()}>
      <div className="flex flex-col w-[50rem] max-h-[90vh] py-2 bg-[var(--Bg)] rounded-xl   items-center relative overflow-y-auto ">
        <div className=" absolute top-2 right-5" onClick={handleClose}>
          <Close
            sx={{
              color: "var(--primary)",
              fontSize: 40,
              ":hover": {
                transition: "transform 0.3s ease-in-out",

                transform: "rotate(90deg)",
              },
            }}
          />
        </div>
        <h1 className=" text-4xl text-[var(--primary)] font-semibold my-2">
          Create new Campaign
        </h1>
        <TextField
          type="text"
          label="Title"
          placeholder="Enter title of the campaign ..."
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          type="text"
          label="Description"
          multiline
          placeholder="Enter Description of the campaign ..."
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />
        <RowRadioButtonsGroup />
        <TextField
          type="text"
          label="Category"
          placeholder="Enter Category of the campaign ..."
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          type="text"
          label="Goal"
          placeholder="Enter Goal of the campaign ..."
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          type="text"
          label="Twitter Link"
          placeholder="Enter twitter profile link ..."
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          type="file"
          label="Background Image"
          placeholder="upload Background Image of the Campaign..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PhotoIcon sx={{ color: "var(--primary)" }} />
                </InputAdornment>
              ),
              inputProps: {
                // accept: "image/*,application/pdf",
              },
            },
          }}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <TextField
          type="file"
          label="Proof of Identity"
          placeholder="upload an Image/File that proves the validity of your Campaign..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PhotoIcon sx={{ color: "var(--primary)" }} />
                </InputAdornment>
              ),
              inputProps: {
                multiple: true,
                // accept: "image/*,application/pdf",
              },
            },
          }}
          sx={{
            marginY: "1rem",
            maxWidth: "25rem",
            "& label": {
              color: "var(--primary)",
              "&.Mui-focused": {
                color: "var(--secondary)",
              },
            },
            "& input": {
              color: "var(--primary)",
              backgroundColor: "var(--Bg)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                color: "var(--primary)",
              },
            },
          }}
          variant="outlined"
          fullWidth
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--primary)",
            color: "var(--Bg)",
            textTransform: "capitalize",
            px: "4rem",
            py: "4px",
            my: "1rem",
            fontSize: 20,
            fontWeight: 500,
            borderRadius: "0.3rem",
          }}
        >
          Create
        </Button>
      </div>
    </div>
  )
}

export default DonationPopup
