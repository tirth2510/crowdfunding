import MainCard from "ui-component/cards/MainCard";
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useAddress, useContractWrite, useStorageUpload } from "@thirdweb-dev/react";
import { constants, ethers } from "ethers";
import useCrowdFundingContract from "hooks/useCrowdFundingContract";
import moment from "moment";
import { FileUploader } from "react-drag-drop-files";
import { useState } from "react";
import { display } from "@mui/system";



const CreateCampaign = () => {
    const navigate = useNavigate();
    const { contract, error } = useCrowdFundingContract();
    const { mutateAsync: upload } = useStorageUpload();
    const address = useAddress();
    console.log(address)
    const { mutateAsync: CreateCampaign } = useContractWrite(contract, 'createCampaign');
    const [ isloading, setisloading ] = useState(false);
    const [form, setForm ] = useState({
        title: '',
        description: '',
        target: '',
        deadline: '',
        image: '',
    });


    const [ imageFile, setImageFile ] = useState(null);

    const fileTypes = ['JPG', 'PNG', 'GIF'];

    const handleImageChange = (file) => {
        setImageFile(file);
    };

    const handleFormFieldChange = (fieldName,e) => {
        setForm({ ...form, [fieldName]: e.target.value });
    };

    const uploadImage = async () => {

        const dataToUpload = [imageFile];
        const uris = await upload({ data: dataToUpload });
        console.log(uris);
        return uris[0];

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setisloading(true);

        try {
            const imageURI = await uploadImage();
            setForm({ ...form, image: imageURI })

            const targetInWei = ethers.utils.parseEther(form.target);
            //adding data to smart contract 
            const data = await CreateCampaign({
                args: [
                    address,
                    form.title,
                    targetInWei,
                    form.description,
                    new Date(form.deadline).getTime(),
                    imageURI.toString()
                ]
            });

            console.log('transaction :', data);
            alert('new campaign created')
            navigate('/home')


        } catch (error) {
            console.log(error)
        }

    }

    if (!address) {
        return (
            <MainCard title="Create Campaign">
                <Typography variant="h6" color="textPrimary">
                    Please connect your wallet to create a campaign.
                </Typography>
            </MainCard>
        );
    }


    return (
        <MainCard title="Create Campaign">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item md={6} sm={12}>
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <FileUploader handleChange={handleImageChange} name="image" types={fileTypes} multiple={false} />
                        </Box>
                        {imageFile && (
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Typography variant="body1">Image Preview:</Typography>
                                <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />
                            </Box>
                        )}
                    </Grid>

                    <Grid item md={6} sm={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            variant="outlined"
                            margin="normal"
                            value={form.title}
                            onChange={(e) => handleFormFieldChange('title', e)}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            margin="normal"
                            multiline
                            rows={4}
                            value={form.description}
                            onChange={(e) => handleFormFieldChange('description', e)}
                        />
                        <TextField
                            fullWidth
                            label="Target Amount (ETH)"
                            variant="outlined"
                            margin="normal"
                            value={form.target}
                            onChange={(e) => handleFormFieldChange('target', e)}
                        />
                        <TextField
                            fullWidth
                            label="Deadline"
                            variant="outlined"
                            margin="normal"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: moment().format("YYYY-MM-DD") }}
                            value={form.deadline}
                            onChange={(e) => handleFormFieldChange('deadline', e)}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button variant="contained" color="primary" type="submit" disabled={isloading} sx={{ mr: 2 }}>
                        {isloading ? <CircularProgress size={24} /> : 'Create Campaign'}
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                </Box>
            </form>
        </MainCard>
    );
};

export default CreateCampaign;




