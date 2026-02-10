/**
 * Shared Material-UI styles for search result accordions (UrbanDict, WordsApi*, MwThesRes, WordAssocRes, etc.).
 */
export const searchAccordionStyles = (theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
        wordBreak: 'break-all',
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
});
