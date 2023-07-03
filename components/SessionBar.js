import { useState, useEffect } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useDebounce } from "../src/useDebounce";
import { validateProvider } from "../src/validateProvider";
import getConfig from "../config";

const config = getConfig();

export function SessionBar() {
  const { session, sessionRequestInProgress } = useSession();

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 2, minHeight: "58px", verticalAlign: "bottom" }}>
        <SessionBarContents
          isLoggedIn={session.info.isLoggedIn}
          loading={sessionRequestInProgress}
        />
      </Box>
      <Divider />
    </Container>
  );
}

function SessionBarContents({ isLoggedIn, loading }) {
  if (loading) {
    return <span>Loading Session&hellip;</span>;
  } else if (isLoggedIn) {
    return <LoggedIn />;
  } else {
    return <Login />;
  }
}

function LoggedIn() {
  const { session, logout } = useSession();

  const handleLogout = async (ev) => {
    ev.preventDefault();
    await logout();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={8}>
        <Box sx={{ paddingTop: 1 }}>
          Logged in as: <code>{session.info.webId}</code>
        </Box>
      </Grid>
      <Grid item xs={6} md={4}>
        <Button
          disableElevation
          variant="contained"
          size="large"
          sx={{ marginTop: "-1px" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Grid>
    </Grid>
  );
}

function Login() {
  const { login } = useSession();

  const [provider, setProvider] = useState(config.defaultIdP);
  const debouncedProvider = useDebounce(provider, 500);

  const [oidcIssuer, setOidcIssuer] = useState(provider);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (debouncedProvider === "") {
      setError("missing_provider");
      setValidating(false);
      return;
    }

    let providerIri = debouncedProvider;
    if (
      !providerIri.startsWith("http://") &&
      !providerIri.startsWith("https://")
    ) {
      providerIri = `https://${providerIri}`;
    }

    setValidating(true);

    validateProvider(providerIri)
      .then(
        (issuer) => {
          setOidcIssuer(issuer);
        },
        (error) => {
          setError(error);
        }
      )
      .finally(() => {
        setValidating(false);
      });
  }, [debouncedProvider]);

  const handleProviderChange = async (ev) => {
    const newValue = ev.target.value;

    setError(false);
    setValidating(true);

    setProvider(newValue);
  };

  const handleLogin = (ev) => {
    ev.preventDefault();

    login({
      oidcIssuer: oidcIssuer,
      clientName: config.demoTitle,
      /* redirectUrl: "http://localhost:3001/",
      clientId: "http://localhost:3001/myappid.jsonld" */
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={8}>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="provider">Provider</InputLabel>
          <OutlinedInput
            size="small"
            id="provider"
            label="Provider"
            inputMode="url"
            endAdornment={<InputState loading={validating} error={error} />}
            value={provider}
            onChange={handleProviderChange}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6} md={4}>
        <Button
          disableElevation
          variant="contained"
          size="large"
          sx={{ marginTop: "-1px" }}
          onClick={handleLogin}
          disabled={!!error || validating}
        >
          Login
        </Button>
      </Grid>
    </Grid>
  );
}

function InputState({ loading, error }) {
  if (loading) {
    return (
      <InputAdornment position="end">
        <CircularProgress
          color="primary"
          variant="indeterminate"
          size="26"
          sx={{
            height: "26px",
            width: "26px",
          }}
        />
      </InputAdornment>
    );
  }

  if (error) {
    return (
      <InputAdornment position="end">
        <Tooltip title={error}>
          <ErrorOutlineIcon color="error" />
        </Tooltip>
      </InputAdornment>
    );
  }

  return null;
}
