"use client"
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'
import '../app/globals.css'
function HeroSection() {

    const imageRef = useRef();
    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            if(scrollPosition>scrollThreshold){
                imageElement.classList.add("scrolled");
            }
            else{
                imageElement.classList.remove("scrolled");
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className='pb-20 px-4 '>
            <div className='container mx-auto text-center'>
                <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title'>
                    Manage Your finances <br/>with Intelligence
                </h1>
                <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
                    All-in-one finance management app that helps you track your expenses, set budgets, and achieve your financial goals.
                </p>
                <div className='flex justify-center space-x-4'>
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>

                    <Link href="/demo">
                        <Button size="lg" variant="outline" className="px-8">Watch Demo</Button>
                    </Link>
                </div>
                <div className='hero-image-wrapper'>
                    <div ref={imageRef} className='hero-image'>
                        <Image src='/banner.jpeg'
                        alt="Dashboard preview"
                        width={1280}
                        height={720}
                        priority
                        className='rounded-lg shadow-2xl border mx-auto'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
