import { Button, Center, Flex, Heading, Switch, Text, useColorMode, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { csv } from 'd3'
import { Graph } from '../kruskalAlgorithm/kruskalAlgorithm'

const url_nodes = 'https://raw.githubusercontent.com/mathbeveridge/asoiaf/master/data/asoiaf-all-nodes.csv'
const url_edges = 'https://raw.githubusercontent.com/mathbeveridge/asoiaf/master/data/asoiaf-all-edges.csv'

let nameAndId = []

export const Home = () => {
const { colorMode, toggleColorMode } = useColorMode()
const [minimumCostGOT, setMinimumCostGOT] = useState(0)
const [treeGOT, setTreeGOT] = useState([])
const [showData, setShowData] = useState(false)
const [isLoading, setIsLoading] = useState(false)
const graph = new Graph(796)

useEffect(()  => {
    csv(url_nodes).then((res) => {
        res.forEach((row, index) => {
            nameAndId.push(index)
            nameAndId.push(row.Label.replaceAll(" ", '-'))
        })
    }).catch((error) => console.log(error))
    csv(url_edges).then((res) => {
        res.forEach((row) => {
            const indexFirstName = nameAndId.indexOf(row.Source)
            const indexSecondName = nameAndId.indexOf(row.Target)
            graph.addEdge(nameAndId[indexFirstName-1], nameAndId[indexFirstName], nameAndId[indexSecondName-1], nameAndId[indexSecondName], parseInt(row.weight))
        })
    }).then(() => {
        const result = graph.Kruskal()
        setMinimumCostGOT(result.minimumCost)
        setTreeGOT(result.kruskalTree)
    }).catch((err) => {
        console.log(err)
    })
}, [])

const handleShowData = () => {
    setIsLoading(true)
    setTimeout(()  => {
        setIsLoading(false)
        setShowData(!showData)
    }, 3000)
    console.log('showData', showData)
}

  return (
    <Flex flexDir="column" h="100vh">
      <header>
        <Flex justify="flex-end" m={4}>
          <Switch onChange={toggleColorMode}>
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
          </Switch>
        </Flex>
      </header>

      <Center h="100%">
        <Center w="100%" margin="auto" >
          <VStack bgColor="blackAlpha.800" color="white" py={8} px={12} borderRadius="lg" spacing={5} justify="flex-start" alignItems="center">
            <Heading fontSize="3xl" color="white">Kruskal Algorithm - GOT Characters</Heading>
            {!showData && 
                <Button 
                onClick={handleShowData} 
                color={colorMode === 'light' ? 'black' : 'white'} 
                leftIcon={<IoMdAdd />} 
                px={6} 
                mt={2} 
                isLoading={isLoading}
                >
                    Create minimum tree
                </Button>
            }
           
            {showData &&
                <>
                    <VStack 
                        maxH="20rem" 
                        overflowY="auto" sx={{
                        '&::-webkit-scrollbar': {
                        width: '12px',
                        height: '10px',
                        borderRadius: '3px',
                        backgroundColor: `gray.600`,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            width: '6px',
                            borderRadius: '3px',
                            height: '30px',
                            backgroundColor: `#9086C7`,
                            },
                        }}
                        >
                        {treeGOT.map((edge, index) => {
                            return <Text key={index}>{edge[0]} and {edge[1]} weight: {edge[2]} connections</Text>
                        })}
                    </VStack>
        
                    <Flex>
                        <Text fontSize="lg">
                            Minimum: {minimumCostGOT} connections
                        </Text>
                    </Flex>
                </>
            }


          </VStack>
        </Center>
      </Center>
    </Flex>
  )
}
