import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

// Components
import { BackgroundImage1,BackgroundImage2, FooterCon, FooterLink, GenerateQuoteButton, GenerateQuoteButtonText, GradientBackgroundCon, QuoteGEneratorInnerCon, QuoteGeneratorCon, QuoteGeneratorSubTitle, QuoteGeneratorTitle, RedSpan} from '@/components/QuoteGenerator/QuoteGeneratorElements'

// Assets
import Clouds1 from '@/assets/cloud-and-thunder.png'
import Clouds2 from '@/assets/cloudy-weather.png'
import { API } from 'aws-amplify'
import { quotesQueryName } from '@/src/graphql/queries'
import { GraphQLResult } from '@aws-amplify/api-graphql'

// interface for our dynamodb object
interface UpdateQuoteInfoData {
  id: string;
  queryName: string;
  quotesGenerated: number;
  createdAt: string;
  updatedAt: string;
}

// type guard for our fetch function
function isGraphQLResultForquotesQueryName(response: any): response is GraphQLResult<{
  quotesQueryName: {
    items: [UpdateQuoteInfoData];
  };
}> {
  return response.data && response.data.quotesQueryName && response.data.quotesQueryName.items;
}



export default function Home() {
  const [numberOfQuotes, setNumberOfQuotes] = useState<Number | null>(0);

// function to fetch our DynamoDB object (quotes generated)
const updateQuoteInfo = async () => {
  try {
    const response = await API.graphql<UpdateQuoteInfoData>({
      query: quotesQueryName,
      authMode: "AWS_IAM",
      variables: {
        queryName: "LIVE"
      },
    })
    console.log('response',response);
    //setNumberOfQuotes();

    //Create type guards
    if (!isGraphQLResultForquotesQueryName(response)) {
      throw new Error('Unexpected response from API.graphql');
    }

    if (!response.data) {
      throw new Error('Response data is undefined');
    }

    const reecivedNumberOfQuotes = response.data.quotesQueryName.items[0].quotesGenerated;
    setNumberOfQuotes(reecivedNumberOfQuotes);
    
  } catch (error) {
    console.log('error getting quote data',error);
  }
}


useEffect(() => {
  updateQuoteInfo();
}, [])

  return (
    <>
      <Head>
        <title>Quote Generator</title>
        <meta name="description" content="A fun quote generator app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Background */}
      <GradientBackgroundCon>

      {/* Quote Generator Modal Pop-Up*/}
      {/* <QuoteGeneratorModal
      /> */}

      {/* Quote Generator */}
      <QuoteGeneratorCon>
        <QuoteGEneratorInnerCon>
          <QuoteGeneratorTitle>
            <QuoteGeneratorSubTitle>
              Looking a verse of the day? Generate a verse card with the verse of the day <FooterLink href="https://bible.org" target="_blank" rel="noopener noreferrer">from the NET Bible</FooterLink>
            </QuoteGeneratorSubTitle>
            <GenerateQuoteButton>
              <GenerateQuoteButtonText 
              //onClick={null}
              >
                Make a Quote
              </GenerateQuoteButtonText>
            </GenerateQuoteButton>
          </QuoteGeneratorTitle>
        </QuoteGEneratorInnerCon>
      </QuoteGeneratorCon>

      {/* Background Images */}
      <BackgroundImage1
        src={Clouds1}
        height="300"
        alt="cloudybackground1"
      />

      <BackgroundImage2
        src={Clouds2}
        height="300"
        alt="cloudybackground1"
      />

      <FooterCon>
        <>
          Quotes Generated: {numberOfQuotes}
          <br/>
          Developed with <RedSpan>❤️</RedSpan> by <FooterLink href="https://www.linkedin.com/in/johnjoy/" target="_blank" rel="noopener noreferrer">@JohnJoy</FooterLink>
        </>
      </FooterCon>

      </GradientBackgroundCon>
    </>
  )
}
