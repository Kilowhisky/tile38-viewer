import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { useCallback, useContext, useEffect, useState } from 'react';
import { KeyStats, KeysResponse, Tile38Context } from '../lib/tile38Connection';

// Based on this: https://mui.com/material-ui/react-accordion/

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))((/*{ theme }*/) => ({
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

interface KeySummary {
  key: string
  count: number
  stats: KeyStats
}

export default function Keys() {
  const tile38 = useContext(Tile38Context);
  const [keys, setKeys] = useState<KeySummary[]>([]);
  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const loadKeys = useCallback(async () => {
    const response = await tile38.raw("KEYS *") as KeysResponse;
    const newKeys = [];

    for (let i = 0; i < response.keys.length; i++) {
      const key = response.keys[i];
      newKeys.push({
        key,
        count: (await tile38.keysCount(key)).count,
        stats: (await tile38.stats(key)).stats[0]!
      })
    }

    setKeys(newKeys.sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase())));

  }, [tile38]);

  useEffect(() => {
    loadKeys();
  }, [loadKeys])

  return (
    <div>
      {keys.map(k => (
        <Accordion key={k.key} expanded={expanded === k.key} onChange={handleChange(k.key)}>
          <AccordionSummary sx={{ '.MuiAccordionSummary-content': { display: 'flex', justifyContent: 'space-between' } }}>
            <span>{k.key}</span>
            <span><HumanFileSize size={k.stats.in_memory_size} /> </span>
            <span>{k.count}</span>
          </AccordionSummary>
          <AccordionDetails>sdfsdf</AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

function HumanFileSize({ size }: { size: number }) {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}